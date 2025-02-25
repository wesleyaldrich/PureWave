package com.purewave.exception;

/**
 * Exception thrown when a requested project is not found in the system.

 * This exception is typically used to indicate that an operation attempted
 * to access a project by its identifier, but no corresponding project
 * could be found in the database or repository.

 * Extends RuntimeException to allow unchecked exception handling.
 */
public class ProjectNotFoundException extends RuntimeException {
    public ProjectNotFoundException(String message) {
        super(message);
    }
}
