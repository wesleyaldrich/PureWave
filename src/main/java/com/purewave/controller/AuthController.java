package com.purewave.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

/**
 * AuthController handles authentication-related endpoints.
 * It provides methods to retrieve authentication tokens and user information.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    /**
     * Retrieves a token from the "authToken" cookie if it exists.
     *
     * @param authToken the value of the "authToken" cookie, can be null if the cookie is not present
     * @return a response entity containing a map with the token key and its value, or null if the token is not present
     */
    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(@CookieValue(name = "authToken", required = false) String authToken) {
        if (authToken != null) {
            return ResponseEntity.ok(Collections.singletonMap("token", authToken));
        }
        return ResponseEntity.ok(Collections.singletonMap("token", null));
    }

    /**
     * Retrieves user information, specifically the email address, if the authenticated principal exists.
     *
     * @param principal the authenticated OIDC user, can be null if no user is authenticated
     * @return a map containing the user's email address if authenticated, or an error message if the principal is null
     */
    @GetMapping("/email")
    public Map<String, String> getUserInfo(@AuthenticationPrincipal OidcUser principal) {
        if (principal == null) {
            return Map.of("error", "null");
        }
        return Map.of("email", principal.getEmail());
    }
}
