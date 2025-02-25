package com.purewave.exception;

/**
 * Represents a custom exception thrown when an API is unavailable or down during a request.
 * This exception extends the {@code RuntimeException} to signify non-recoverable runtime errors
 * specifically related to unavailable APIs.
 */
public class ApiDownException extends RuntimeException {
    public ApiDownException(String message) {
        super(message);
    }
}
