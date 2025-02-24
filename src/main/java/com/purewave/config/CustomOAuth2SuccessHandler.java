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

@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2AuthorizedClientService authorizedClientService;

    public CustomOAuth2SuccessHandler(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

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