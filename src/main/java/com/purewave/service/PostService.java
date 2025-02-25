package com.purewave.service;

import com.purewave.exception.PostNotFoundException;
import com.purewave.exception.UnauthorizedException;
import com.purewave.model.Post;
import com.purewave.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

/**
 * Service layer responsible for handling business logic related to posts within the application.
 * This class interacts with the PostRepository to manage database operations involving
 * {@link Post} entities and provides methods for creating, retrieving, updating, and deleting posts.

 * The service also integrates with the UserProfileService to handle user profile-related tasks
 * such as caching user profile images. Additionally, it implements caching mechanisms
 * to enhance performance by storing frequently accessed data.
 */
@Service
public class PostService {
    /**
     * The PostRepository field serves as the injected dependency for performing
     * database operations related to the {@link Post} entity. It is an instance
     * of {@link PostRepository}, which extends {@link MongoRepository}, and
     * provides CRUD functionalities and custom query implementations for managing
     * the posts stored in the MongoDB database.

     * This repository supports operations such as:
     * - Retrieving primary posts, i.e., posts not attached to any parent post.
     * - Fetching replies associated with a specific parent post.
     * - Saving, updating, and deleting post entities in the database.

     * The PostRepository is vital for managing persistence and executing post-related
     * queries, ensuring seamless interaction between the {@link PostService} class
     * and the underlying database.

     * It is annotated with {@code @Autowired}, allowing Spring to automatically
     * inject its implementation at runtime.
     */
    @Autowired
    private PostRepository postRepository;

    /**
     * Service for handling user profile-related operations.
     * Provides methods to manage and cache user profile images.

     * This service is used within the PostService class to handle
     * operations related to user profile information such as saving
     * profile images or retrieving already cached profile image URLs.
     */
    @Autowired
    private UserProfileService userProfileService;

    /**
     * Retrieves a list of primary posts from the database.
     * Primary posts are characterized by having a null "attachedTo" field,
     * meaning they are not replies to any other posts.
     *
     * @return a {@code List} of {@code Post} objects representing the primary posts.
     */
    // Fetch only primary posts (attachedTo == null)
    @Cacheable(value = "primaryPosts")
    public List<Post> getPrimaryPosts() {
        return postRepository.findByAttachedToIsNull();
    }

    /**
     * Retrieves a list of replies for a specific post identified by its ID.
     * Replies are posts that have their "attachedTo" field set to the specified post ID.
     *
     * @param postId the unique identifier of the post for which replies are to be retrieved.
     * @return a list of {@code Post} objects representing the replies associated with the given post ID.
     */
    // Fetch replies for a given post ID
    @Cacheable(value = "replies", key = "#postId")
    public List<Post> getRepliesByPostId(String postId) {
        return postRepository.findByAttachedTo(postId);
    }

    /**
     * Saves a post with the specified content, optional attachment, and user authentication details.
     * If the post is a reply (indicated by the presence of a parent post ID), the parent post's reply
     * count will be updated accordingly. The method also ensures the relevant user profile image
     * is cached and processes the attachment file if provided.
     *
     * @param id The ID of the parent post, if the post is a reply. Null for primary posts.
     * @param content The textual content of the post.
     * @param attachment An optional file attachment associated with the post. May be null or empty.
     * @param authentication The authentication object containing details of the currently authenticated user.
     * @return The saved Post object.
     * @throws IOException If an error occurs during file processing or profile image management.
     */
    @CachePut(value = "posts", key = "#result.id")
    public Post savePost(String id, String content, MultipartFile attachment, Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        // Cache the user's profile image
        String cachedProfileImageUrl = userProfileService.getOrSaveUserProfile(email, picture);

        Post post = new Post();
        post.setUserId(email);
        post.setName(name);
        post.setPicture(cachedProfileImageUrl);
        post.setContent(content);
        post.setAttachedTo(id);
        post.setReplyCount(0);

        // Save attachment if exists
        if (attachment != null && !attachment.isEmpty()) {
            String fileName = saveFile(attachment);
            post.setAttachment("/attachments/" + fileName);
        }

        // Update parent post if replying
        if (id != null) {
            Post parentPost = postRepository.findById(id)
                    .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));

            updateRepliedPost(parentPost, 1);
        }

        return postRepository.save(post);
    }

    /**
     * Updates the reply count of a specific post and persists the changes to the database.
     * This method is typically used when replies to a post are added or removed.

     * The method calculates the new reply count by adding the specified change value to the
     * current reply count. If the reply count is null, it initializes the count with the
     * provided change value.

     * This operation also updates the relevant caches:
     * 1. Updates the cache entry for the post in the "posts" cache.
     * 2. Evicts the cache entry for the post's reply count in the "replyCount" cache.
     *
     * @param repliedPost The {@link Post} object representing the post whose reply
     *                    count is being updated.
     * @param change      The value to adjust the reply count by (e.g., +1 when a reply is added,
     *                    -1 when a reply is removed).
     */
    @CachePut(value = "posts", key = "#repliedPost.id")
    @CacheEvict(value = "replyCount", key = "#repliedPost.id")
    public void updateRepliedPost(Post repliedPost, Integer change) {
        repliedPost.setReplyCount((repliedPost.getReplyCount() == null ? change : repliedPost.getReplyCount()) + change);
        postRepository.save(repliedPost);
    }

    /**
     * Edits the content of an existing post. Updates the post's text content and optionally
     * updates or removes the associated file attachment. Ensures that only the authorized
     * user can edit their post.
     *
     * @param id The unique identifier of the post to be edited.
     * @param newContent The updated textual content for the post.
     * @param file An optional file to replace the current attachment. If null or empty, the attachment will be removed.
     * @param authentication The authentication details of the currently logged-in user.
     * @return The updated Post object after saving the changes.
     * @throws IOException If an error occurs during file handling or processing.
     */
    @CachePut(value = "posts", key = "#id")
    public Post editPost(String id, String newContent, MultipartFile file, Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));

        // Validate user
        if (!existingPost.getUserId().equals(email)) {
            throw new UnauthorizedException("You are not authorized to edit this post.");
        }

        existingPost.setContent(newContent);

        // Handle file upload (if a new file is provided)
        if (file != null && !file.isEmpty()) {
            String fileName = saveFile(file);
            existingPost.setAttachment("/attachments/" + fileName);
        }
        else {
            existingPost.setAttachment(null);
        }

        return postRepository.save(existingPost);
    }


    /**
     * Deletes a post identified by its unique ID, including all its nested replies,
     * while ensuring that the operation is authorized for the currently authenticated user.
     * This method also updates the parent post's reply count (if applicable) and
     * manages relevant cache entries during the process.
     *
     * @param id The unique identifier of the post to be deleted.
     * @param authentication The {@link Authentication} object containing the details of
     *                        the currently authenticated user, used for authorization checks.
     * @throws PostNotFoundException If the post with the specified ID or its parent post is not found.
     * @throws UnauthorizedException If the authenticated user is not authorized to delete the post.
     */
    @CacheEvict(value = {"posts", "primaryPosts", "replies", "replyCount"}, key = "#id", allEntries = true)
    public void deletePost(String id, Authentication authentication) {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));

        // Validate user
        if (!existingPost.getUserId().equals(email)) {
            throw new UnauthorizedException("You are not authorized to delete this post.");
        }

        // Recursively delete all replies and evict cache
        deleteRepliesRecursively(id);

        // Update reply count of parent post
        if (existingPost.getAttachedTo() != null) {
            String parentId = existingPost.getAttachedTo();
            Post parentPost = postRepository.findById(parentId)
                    .orElseThrow(() -> new PostNotFoundException("Parent post not found with ID: " + id));

            // Update parent and cache
            updateRepliedPost(parentPost, -1);
        }

        // Delete the main post
        postRepository.deleteById(id);
    }

    /**
     * Recursively deletes all replies associated with a given post, including their nested replies.
     * This method performs a depth-first traversal to ensure all reply chains are deleted.
     * Cache entries related to posts, replies, and reply counts are invalidated for the given post.
     *
     * @param postId the unique identifier of the post whose replies are to be deleted recursively.
     */
    @CacheEvict(value = {"posts", "replies", "replyCount"}, key = "#postId", allEntries = true)
    private void deleteRepliesRecursively(String postId) {
        List<Post> replies = postRepository.findByAttachedTo(postId);

        for (Post reply : replies) {
            deleteRepliesRecursively(reply.getId());
            postRepository.deleteById(reply.getId());
        }
    }

    /**
     * Saves the provided file to a predefined directory on the server and returns the generated file name.
     * The method ensures the target directory exists and appends a unique timestamp to the original file name
     * to prevent overwriting existing files.
     *
     * @param file the file to be saved, encapsulated as a {@code MultipartFile}.
     * @return the name of the saved file, including the generated unique prefix.
     * @throws IOException if an error occurs while saving the file to the target directory.
     */
    private String saveFile(MultipartFile file) throws IOException {
        String uploadDir = "attachments/";
        File uploadFolder = new File(uploadDir);

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}
