package com.purewave.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler is a controller advice class used to handle exceptions in a centralized manner
 * across the application. It uses specific methods to handle particular exception types and provides
 * appropriate HTTP responses to the client.

 * This class includes handlers for {@code UnauthorizedException}, {@code ApiDownException},
 * and other general exceptions, mapping them to corresponding HTTP status codes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles exceptions of type {@code UnauthorizedException}. This method returns a {@code ResponseEntity}
     * with a {@code FORBIDDEN} HTTP status and a response body containing an error message extracted from the exception.
     *
     * @param ex the {@code UnauthorizedException} that was thrown
     * @return a {@code ResponseEntity} containing an error message and an HTTP status of {@code FORBIDDEN}
     */
    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<Map<String, String>> handleUnauthorizedException(UnauthorizedException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    /**
     * Handles exceptions of type {@code ApiDownException} that are thrown when a dependent API,
     * such as a Flask API, is unavailable or down. This method constructs a response body containing
     * an error message extracted from the exception and returns it with an HTTP status of {@code SERVICE_UNAVAILABLE}.
     *
     * @param ex the {@code ApiDownException} instance containing details about the API unavailability
     * @return a {@code ResponseEntity} containing a map with an error message and an HTTP status of {@code SERVICE_UNAVAILABLE}
     */
    @ExceptionHandler(ApiDownException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public ResponseEntity<Map<String, String>> handleFlaskApiDown(ApiDownException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }

    /**
     * Handles exceptions of type {@code Exception} that are not explicitly caught by more specific handlers.
     * This method is used as a fallback exception handler for catching any general exception and returning
     * an appropriate internal server error response to the client.
     *
     * @param ex the {@code Exception} instance that was thrown
     * @return a {@code ResponseEntity} containing a map with an error message
     *         and a HTTP status of {@code INTERNAL_SERVER_ERROR}
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Audio API might be down.");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}