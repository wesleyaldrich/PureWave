package com.purewave.controller;

import com.purewave.service.AudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * AudioController is a REST controller that handles audio file upload and processing requests.
 * It provides an endpoint for uploading audio files, which are then processed and saved.
 * The controller delegates the processing logic to the AudioService class.

 * Endpoints:
 * - POST /audio: Handles audio file uploads and returns the filenames of processed audio files.
 */
@RestController
@RequestMapping("/audio")
public class AudioController {
    /**
     * An instance of the AudioService class, responsible for processing and saving audio files.
     * The service handles operations such as saving uploaded audio files locally, communicating
     * with an external Flask API for enhancements, and managing both input ("dry") and processed
     * ("wet") audio files. The service ensures directory structure is maintained and generates
     * unique filenames to avoid conflicts.

     * The AudioController relies on this service to delegate the audio file handling tasks,
     * including validation, processing, and saving of files.
     */
    @Autowired
    private AudioService audioService;

    /**
     * Handles audio file upload via a POST request. The uploaded file is saved
     * locally and processed through the audio service for enhancement. The method
     * returns the filenames for both the original and enhanced audio files.
     *
     * @param file the audio file to be uploaded, provided as a multipart file
     * @return a comma-separated string containing the unique filenames for the
     *         original (dry) and enhanced (wet) audio files
     * @throws IOException if an I/O error occurs during file handling or processing
     */
    @PostMapping
    public String uploadAudio(@RequestParam("audio") MultipartFile file) throws IOException {
        return audioService.saveAudio(file);
    }
}
