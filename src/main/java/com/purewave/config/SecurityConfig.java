package com.purewave.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseCookie;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuration class for Spring Security that sets up security policies such as request
 * authorization, CORS policies, CSRF handling, OAuth2 login, and logout behavior.

 * This class uses Spring Security's declarative API to configure the security filter chain
 * for handling HTTP requests.

 * Annotations:
 * - {@code @Configuration}: Indicates that this class is a source of bean definitions for the application context.
 * - {@code @EnableWebSecurity}: Enables Web Security features in Spring Security.

 * Methods:
 * {@code securityFilterChain}:
 * - Configures the SecurityFilterChain for handling request authorizations, CORS, CSRF, OAuth2 login,
 *   and logout mechanisms.
 * - Disables CSRF protection to prevent issues with token-based authentication for REST APIs.
 * - Configures CORS policies using a custom {@code CorsConfigurationSource}.
 * - Sets up request authorization policies for various HTTP methods and paths.
 * - Enables OAuth2 login with a custom success handler {@code CustomOAuth2SuccessHandler}.
 * - Defines custom logout behavior to invalidate sessions, clear authentication, and clear security tokens.
 * - Returns the configured SecurityFilterChain.

 * {@code corsConfigurationSource}:
 * - Configures Cross-Origin Resource Sharing (CORS) for the application.
 * - Allows specific origins, HTTP methods (GET, POST, PUT, DELETE), and headers (Authorization, Content-Type).
 * - Enables credentials to be sent with cross-origin requests.
 * - Registers the CORS configuration for all paths.
 * - Returns the {@code CorsConfigurationSource} bean.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the security filter chain for the application. This method sets up
     * request authorization rules, enables OAuth2 login handling with a custom success handler,
     * and configures logout behavior including clearing authentication tokens.
     *
     * @param http the {@code HttpSecurity} object used to configure security filters and rules
     * @param successHandler the handler for successful OAuth2 login events
     * @return the configured {@code SecurityFilterChain} instance
     * @throws Exception if any error occurs during the configuration of the security chain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomOAuth2SuccessHandler successHandler) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers(HttpMethod.GET, "/data/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/data/projects/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/data/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/data/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/data/**").authenticated()
                        .requestMatchers("/data/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/audio/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/audio/**").authenticated()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(successHandler)
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            // Clear authentication token cookie
                            ResponseCookie cookie = ResponseCookie.from("authToken", "")
                                    .httpOnly(true)
                                    .path("/")
                                    .maxAge(0) // Expire immediately
                                    .build();

                            response.addHeader("Set-Cookie", cookie.toString());
                        })
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                );

        return http.build();
    }

    /**
     * Creates and configures a {@link CorsConfigurationSource} bean for handling
     * Cross-Origin Resource Sharing (CORS) requests in the application. This method
     * sets the allowed origins, HTTP methods, headers, and other CORS configurations
     * to ensure controlled access to application resources.
     *
     * @return a configured {@link CorsConfigurationSource} that defines the CORS
     *         rules for the application.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080"));  // ✅ Allow frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
