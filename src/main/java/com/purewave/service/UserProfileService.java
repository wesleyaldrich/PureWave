package com.purewave.service;

import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.URL;

@Service
public class UserProfileService {

    private static final String PROFILE_IMAGE_DIRECTORY = "user-profile-images/";

    // Fetch the cached profile image URL or save a new one
    @Cacheable(value = "userProfiles", key = "#email")
    public String getOrSaveUserProfile(String email, String profileImageUrl) {
        // Directory for the user's profile image
        Path userDirectory = Paths.get(PROFILE_IMAGE_DIRECTORY, email);
        Path imagePath = userDirectory.resolve("profile.jpg");

        // Check if the profile image already exists on the server
        if (Files.exists(imagePath)) {
            return imagePath.toString(); // Return the cached image path
        }

        // Download and save the profile image
        try {
            Files.createDirectories(userDirectory); // Ensure the directory exists
            URL url = new URL(profileImageUrl); // Fetch the image from the provided URL
            Files.copy(url.openStream(), imagePath); // Save it to the server
        } catch (IOException e) {
            throw new RuntimeException("Failed to save profile image for user: " + email, e);
        }

        return imagePath.toString(); // Return the saved image path
    }
}
