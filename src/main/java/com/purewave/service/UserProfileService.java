package com.purewave.service;

import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.URL;

/**
 * Service class for managing user profile-related operations.

 * This class provides functionality for caching, retrieving, and saving user profile
 * images. It ensures that profile images are persistently stored and efficiently accessed
 * by leveraging caching mechanisms. The profile images are managed in a structured
 * directory corresponding to user-specific identifiers such as email.
 */
@Service
public class UserProfileService {

    /**
     * Directory path where user profile images are stored.

     * This constant defines the root directory for managing and saving
     * profile images associated with user accounts. It is used to organize
     * images based on user-specific subdirectories, ensuring efficient
     * access and management of user-related image files.
     */
    private static final String PROFILE_IMAGE_DIRECTORY = "user-profile-images/";

    /**
     * Retrieves the cached profile image path for a user based on their email or downloads
     * and stores the image if it is not already cached.

     * The method utilizes a caching layer to check if an existing profile image is available.
     * If not present, it downloads the image from the provided profile image URL, saves it
     * in a user-specific directory, and returns the file path.
     *
     * @param email The email address of the user. Used to determine the directory and cache key for the profile image.
     * @param profileImageUrl The URL of the profile image to download and save if not already cached.
     * @return A string representing the path to the cached or newly saved profile image.
     * @throws RuntimeException If an error occurs during directory creation or image downloading and saving.
     */
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
