package com.purewave.repository;

import com.purewave.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByAttachedToIsNull();
    List<Post> findByAttachedTo(String attachedTo);
}
