package com.purewave.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a post entity in the application. A post can be a primary post
 * (not attached to any other post) or a reply (attached to another post).

 * This class provides the structure to store and manage various details
 * about a post, including its content, associated user information, and
 * any attachments.

 * Fields:
 * - id: The unique identifier for the post.
 * - userId: The unique identifier for the user who created the post.
 * - name: The name of the user who created the post.
 * - picture: The profile picture URL of the user who created the post.
 * - content: The textual content of the post.
 * - attachment: The URL or path to an attached file associated with the post.
 * - attachedTo: The ID of the parent post if the current post is a reply; null for primary posts.
 * - replyCount: The number of replies to the post.
 */
@Document(collection = "posts")
@Data
public class Post {

    @Id
    private String id;
    private String userId;
    private String name;
    private String picture;
    private String content;
    private String attachment;
    private String attachedTo;
    private Integer replyCount;
}
