package com.purewave.repository;

import com.purewave.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Repository interface for managing {@link Post} entities in a MongoDB database.
 * Extends {@link MongoRepository} to provide CRUD operations and custom query
 * methods for posts.
 */
public interface PostRepository extends MongoRepository<Post, String> {
    /**
     * Retrieves a list of posts where the "attachedTo" field is null.
     * This typically represents primary posts that are not replies to any other post.
     *
     * @return a list of {@code Post} objects with a null "attachedTo" field.
     */
    List<Post> findByAttachedToIsNull();
    /**
     * Retrieves a list of posts that are attached to a specific parent post.
     * The "attachedTo" field in the posts is used to identify their parent post.
     *
     * @param attachedTo the unique identifier of the parent post to which the posts are attached.
     * @return a list of {@code Post} objects that are replies to the specified parent post.
     */
    List<Post> findByAttachedTo(String attachedTo);
}
