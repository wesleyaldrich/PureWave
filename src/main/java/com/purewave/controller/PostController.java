package com.purewave.controller;

import com.purewave.model.Post;
import com.purewave.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * The PostController handles HTTP requests related to posts and their replies.
 * It provides endpoints to retrieve, create, edit, and delete posts.
 * Each method is mapped to specific HTTP verbs and paths, enabling interaction with the post data.
 */
@RestController
@RequestMapping("/data/posts")
public class PostController {
    @Autowired
    private PostService postService;

    /**
     * Retrieves a list of primary posts. Primary posts are posts that are not replies
     * (i.e., their `attachedTo` field is null).
     *
     * @return a list of {@code Post} objects representing the primary posts.
     */
    @GetMapping
    public List<Post> getPrimaryPosts() {
        return postService.getPrimaryPosts();
    }

    /**
     * Retrieves a list of replies for a given post ID.
     *
     * @param id The ID of the post for which to retrieve replies.
     * @return A list of {@code Post} objects representing the replies associated with the specified post ID.
     */
    @GetMapping("/{id}")
    public List<Post> getRepliesByPostId(@PathVariable String id) {
        return postService.getRepliesByPostId(id);
    }

    /**
     * Creates a new post with the provided content and optional attachment.
     *
     * @param content The textual content of the post.
     * @param attachment An optional file attachment to be associated with the post.
     *                   May be null or absent.
     * @param authentication The authentication object holding details of the currently
     *                        authenticated user.
     * @return The newly created Post object.
     * @throws IOException If an error occurs during file processing.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Post createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment,
            Authentication authentication) throws IOException {

        return postService.savePost(null, content, attachment, authentication);
    }

    /**
     * Creates a reply post to an existing post identified by the provided ID.
     *
     * @param id The ID of the parent post to which the reply is being made.
     * @param content The textual content of the reply post.
     * @param attachment An optional file attachment for the reply post.
     * @param authentication The authentication object containing information about the currently authenticated user.
     * @return The created {@code Post} object representing the reply post.
     * @throws IOException If an error occurs during file handling or processing.
     */
    @PostMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Post createReplyPost(
            @PathVariable String id,
            @RequestParam("content") String content,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment,
            Authentication authentication) throws IOException {

        return postService.savePost(id, content, attachment, authentication);
    }

    /**
     * Edits the content of an existing post. Optionally, updates the attachment associated with the post.
     *
     * @param id The ID of the post to be edited.
     * @param newContent The updated content for the post.
     * @param file An optional updated attachment file, if applicable. If null or empty, the previous attachment is removed.
     * @param authentication The authentication object containing information about the currently authenticated user.
     * @return The updated Post object after the modifications are saved.
     * @throws IOException If an error occurs during file handling or processing.
     */
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public Post editPost(
            @PathVariable String id,
            @RequestParam("content") String newContent,
            @RequestParam(value = "attachment", required = false) MultipartFile file,
            Authentication authentication) throws IOException {

        return postService.editPost(id, newContent, file, authentication);
    }


    /**
     * Deletes a specific post identified by the given ID. The deletion process
     * includes validation to ensure the authenticated user has the appropriate
     * permissions to delete the post. Replies associated with the post are also
     * removed recursively, and relevant caches are updated accordingly.
     *
     * @param id The unique identifier of the post to be deleted.
     * @param authentication The authentication object containing information
     *                        about the currently authenticated user.
     */
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id, Authentication authentication) {
        postService.deletePost(id, authentication);
    }
}
