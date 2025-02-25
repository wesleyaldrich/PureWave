package com.purewave.exception;

/**
 * Exception thrown when a post with a specified identifier is not found in the repository.

 * This exception is typically used in scenarios where an operation requires the retrieval of
 * a specific post that does not exist, such as fetching, editing, or deleting a post by its ID.

 * The exception provides an error message indicating the details of the missing post,
 * such as its unique identifier.

 * This exception extends the {@link RuntimeException}, allowing it to be thrown
 * without mandatory handling in the code.
 */
public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(String message) {
        super(message);
    }
}
