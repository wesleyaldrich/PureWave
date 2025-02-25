package com.purewave.service;

import com.purewave.exception.ApiDownException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

/**
 * The AudioService class handles the saving and processing of audio files.
 * It provides functionality to save uploaded audio files locally and interact
 * with an external Flask API for audio enhancement. The service ensures proper
 * directory management and generates unique filenames for both the input (dry)
 * and processed (wet) audio files.

 * Key Features:
 * - Saves original audio files to a designated directory.
 * - Interacts with a Flask API to process and enhance audio files.
 * - Generates unique filenames for saved audio files to avoid conflicts.
 * - Manages output of enhanced audio files to a separate directory.

 * Exceptions:
 * - Handles I/O errors during file operations or communication.
 * - Throws custom ApiDownException if the Flask API is unavailable.

 * Dependencies:
 * - `org.springframework.web.multipart.MultipartFile` for handling uploaded audio files.
 * - `RestTemplate` for communication with the Flask API.
 * - Java NIO and IO classes for file operations.
 */
@Service
public class AudioService {
    /**
     * Represents the file path for storing "dry" (original and unprocessed) audio files.
     * This constant is used to define the directory where audio files uploaded
     * to the application will be saved before any processing or enhancement occurs.
     * It helps to manage storage and ensure consistency across audio files
     * designated as unprocessed input.
     */
    private static final String DRY_AUDIO_PATH = "uploads-audio/dry/";
    /**
     * Specifies the directory path where the processed ("wet") audio files are stored.
     * This variable is used to organize and locate the output files produced by the audio enhancement process.
     * Typically, the "wet" audio refers to the processed version of the original ("dry") audio file.
     */
    private static final String WET_AUDIO_PATH = "uploads-audio/wet/";
    /**
     * The base URL for the Flask API used to process audio files.
     * This constant is utilized by methods such as {@code sendToFlask} to interact with the Flask service.
     * The Flask API is expected to handle audio enhancement requests and return processed audio data.

     * The default value points to a locally hosted Flask service at {@code http://localhost:5555/audio}.
     * Ensure that the Flask API is running and accessible at this endpoint to enable proper functionality.
     */
    private static final String FLASK_API_URL = "http://localhost:5555/audio";

    /**
     * Saves the uploaded audio file locally and processes it using an external Flask API.
     * The method generates unique filenames for both the original ("dry") and processed ("wet") audio files,
     * ensures the necessary directories exist, uploads the file for enhancement, and returns the filenames.
     *
     * @param file the uploaded audio file provided as a {@code MultipartFile}
     * @return a comma-separated string containing the unique filenames for the original (dry) and processed (wet) audio files
     * @throws IOException if an I/O error occurs during file handling or processing
     * @throws ApiDownException if the Flask API required for audio enhancement is unavailable
     */
    public String saveAudio(MultipartFile file) throws IOException {
        // Ensure the upload directories exist
        Path dryPath = Paths.get(DRY_AUDIO_PATH);
        Path wetPath = Paths.get(WET_AUDIO_PATH);

        if (!Files.exists(dryPath)) {
            Files.createDirectories(dryPath);
        }

        if (!Files.exists(wetPath)) {
            Files.createDirectories(wetPath);
        }

        // Generate a unique filename
        String id = String.valueOf(System.currentTimeMillis());
        String originalFilenameDry = Objects.requireNonNull(file.getOriginalFilename());
        String uniqueFilenameDry = id + "_" + originalFilenameDry;

        // Save dry audio file locally
        Path dryFilePath = dryPath.resolve(uniqueFilenameDry);
        Files.copy(file.getInputStream(), dryFilePath, StandardCopyOption.REPLACE_EXISTING);

        // Send the file to Flask API for enhancement
        try {
            byte[] wetAudioData = sendToFlask(dryFilePath);

            // Save wet audio file locally
            String uniqueFilenameWet = "enhanced_" + id + "_" + originalFilenameDry;
            Path wetFilePath = wetPath.resolve(uniqueFilenameWet);
            Files.write(wetFilePath, wetAudioData);

            // Return the unique filenames for both dry and wet files
            return uniqueFilenameDry + "," + uniqueFilenameWet;
        } catch (ApiDownException ex) {
            throw new ApiDownException("Flask API is down.");
        }
    }

    /**
     * Sends a locally stored audio file to a Flask API for processing and retrieves the processed audio data.
     * This method performs a POST request with the audio file as a multipart form-data object.
     *
     * @param dryFilePath the file path of the audio to be sent, provided as a {@code Path}
     * @return a byte array containing the processed audio data received from the Flask API
     * @throws IOException if an error occurs during communication with the Flask API or if the response status is not OK
     * @throws ApiDownException if the Flask API is unavailable or fails to respond
     */
    private byte[] sendToFlask(Path dryFilePath) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        // Set the contentType in headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Set "audio" in body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("audio", new FileSystemResource(dryFilePath.toFile()));

        // Combine headers and body, send to flask
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(FLASK_API_URL, HttpMethod.POST, requestEntity, byte[].class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new IOException("API failure on enhancing audio: " + response.getStatusCode());
            }
        } catch (ApiDownException ex) {
            throw new ApiDownException("Flask API is down.");
        }
    }
}
