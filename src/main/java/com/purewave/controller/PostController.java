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

@RestController
@RequestMapping("/data/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getPrimaryPosts() {
        return postService.getPrimaryPosts();
    }

    @GetMapping("/{id}")
    public List<Post> getRepliesByPostId(@PathVariable String id) {
        return postService.getRepliesByPostId(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Post createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment,
            Authentication authentication) throws IOException {

        return postService.savePost(null, content, attachment, authentication);
    }

    @PostMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Post createReplyPost(
            @PathVariable String id,
            @RequestParam("content") String content,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment,
            Authentication authentication) throws IOException {

        return postService.savePost(id, content, attachment, authentication);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public Post editPost(
            @PathVariable String id,
            @RequestParam("content") String newContent,
            @RequestParam(value = "attachment", required = false) MultipartFile file,
            Authentication authentication) throws IOException {

        return postService.editPost(id, newContent, file, authentication);
    }


    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id, Authentication authentication) {

        postService.deletePost(id, authentication);
    }
}
