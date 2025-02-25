package com.purewave.exception;

/**
 * A runtime exception that is thrown to indicate that a user is not authorized
 * to perform a specific operation or access a particular resource.

 * This exception is typically used in scenarios where an action requires the
 * user to satisfy certain authorization criteria, and the user has failed to meet them.
 * For example, attempting to modify or delete a resource that belongs to another user.

 * It is often handled globally within an application to provide appropriate HTTP
 * status codes and error messages in the response.
 *
 * @see RuntimeException
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
