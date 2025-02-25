package com.purewave.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * CustomOAuth2SuccessHandler handles the success event of OAuth2 login authentication.
 * It is responsible for processing the post-authentication tasks such as
 * storing the user's OAuth2 authentication token in an HTTP cookie and redirecting
 * the user to the homepage after successful login.

 * This handler extends the SimpleUrlAuthenticationSuccessHandler to customize
 * the behavior of authentication success in an OAuth2 context. It uses
 * OAuth2AuthorizedClientService to retrieve the authorized client information
 * and extracts the access token to set it as an HTTP cookie.
 */
@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    /**
     * The OAuth2AuthorizedClientService instance used for retrieving and managing
     * OAuth2AuthorizedClient details, such as access tokens and client credentials.
     * This is a final field, ensuring that the service reference remains immutable
     * throughout the lifecycle of the containing class.
     */
    private final OAuth2AuthorizedClientService authorizedClientService;

    /**
     * Constructs an instance of CustomOAuth2SuccessHandler using the provided
     * OAuth2AuthorizedClientService for retrieving and managing authorized client details.
     *
     * @param authorizedClientService the service used to manage OAuth2AuthorizedClient instances,
     *                                 which provides access to authorized client details such as tokens
     */
    public CustomOAuth2SuccessHandler(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

    /**
     * Handles successful authentication events, such as storing the authentication
     * token as an HTTP cookie and redirecting the user to the homepage.
     *
     * @param request the HTTP request during which the authentication occurred
     * @param response the HTTP response object to which the authentication result is written
     * @param authentication the authentication object containing user authentication details
     * @throws IOException if an input or output exception occurs while handling the response
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                    oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName());

            if (authorizedClient != null) {
                Cookie authCookie = getCookie(authorizedClient);

                response.addCookie(authCookie);
            }
        }

        // Redirect user to homepage
        response.sendRedirect("/");
    }

    /**
     * Generates an HTTP-only, secure cookie containing the access token from the provided
     * OAuth2AuthorizedClient. The cookie is configured to be accessible site-wide, have a
     * maximum age of 1 hour, and only be sent over HTTPS.
     *
     * @param authorizedClient the OAuth2AuthorizedClient instance that provides the access token
     *                         to be stored in the cookie
     * @return a Cookie instance configured with the access token and additional security settings
     */
    private static Cookie getCookie(OAuth2AuthorizedClient authorizedClient) {
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        // Create an HTTP-only, Secure cookie
        Cookie authCookie = new Cookie("authToken", accessToken);
        authCookie.setHttpOnly(true);  // Prevent JavaScript access (XSS protection)
        authCookie.setSecure(true);    // Send only over HTTPS
        authCookie.setPath("/");       // Accessible site-wide
        authCookie.setMaxAge(3600);    // Expire after 1 hour
        return authCookie;
    }
}