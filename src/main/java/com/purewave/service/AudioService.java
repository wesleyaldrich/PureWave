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

@Service
public class AudioService {
    private static final String DRY_AUDIO_PATH = "uploads-audio/dry/";
    private static final String WET_AUDIO_PATH = "uploads-audio/wet/";
    private static final String FLASK_API_URL = "http://localhost:5555/audio";

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
