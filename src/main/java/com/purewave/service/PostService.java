package com.purewave.service;

import com.purewave.exception.PostNotFoundException;
import com.purewave.exception.UnauthorizedException;
import com.purewave.model.Post;
import com.purewave.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
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

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserProfileService userProfileService;

    // Fetch only primary posts (attachedTo == null)
    @Cacheable(value = "primaryPosts")
    public List<Post> getPrimaryPosts() {
        return postRepository.findByAttachedToIsNull();
    }

    // Fetch replies for a given post ID
    @Cacheable(value = "replies", key = "#postId")
    public List<Post> getRepliesByPostId(String postId) {
        return postRepository.findByAttachedTo(postId);
    }

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

    @CachePut(value = "posts", key = "#repliedPost.id")
    @CacheEvict(value = "replyCount", key = "#repliedPost.id")
    public void updateRepliedPost(Post repliedPost, Integer change) {
        repliedPost.setReplyCount((repliedPost.getReplyCount() == null ? change : repliedPost.getReplyCount()) + change);
        postRepository.save(repliedPost);
    }

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

    @CacheEvict(value = {"posts", "replies", "replyCount"}, key = "#postId", allEntries = true)
    private void deleteRepliesRecursively(String postId) {
        List<Post> replies = postRepository.findByAttachedTo(postId);

        for (Post reply : replies) {
            deleteRepliesRecursively(reply.getId());
            postRepository.deleteById(reply.getId());
        }
    }

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
