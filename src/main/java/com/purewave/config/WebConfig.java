package com.purewave.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for customizing the Spring Web MVC framework settings.
 * This class implements {@link WebMvcConfigurer} to provide custom resource handling
 * and Cross-Origin Resource Sharing (CORS) settings for a web application.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures resource handlers to serve static resources efficiently for specific URL patterns.
     * This method maps HTTP requests to resources*/
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/user-profile-images/**")
                .addResourceLocations("file:./user-profile-images/");

        registry.addResourceHandler("/audio/files/dry/**")
                .addResourceLocations("file:./uploads-audio/dry/");

        registry.addResourceHandler("/audio/files/wet/**")
                .addResourceLocations("file:./uploads-audio/wet/");

        registry.addResourceHandler("/attachments/**")
                .addResourceLocations("file:./attachments/");
    }

    /**
     * Defines a bean for configuring the CORS (Cross-Origin Resource Sharing) settings in the application.
     * This allows the application to define rules for cross-origin requests, specifying allowed origins,
     * HTTP methods, and credentials policies.
     *
     * @return a {@link WebMvcConfigurer} instance with customized CORS configuration.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            /**
             * Configures Cross-Origin Resource Sharing (CORS) mappings for the application.
             * This method specifies allowed origins, HTTP methods, and credentials policy
             * for accessing the application's resources.
             *
             * @param registry the {@link CorsRegistry} used to define CORS configurations
             *                 such as allowed paths, origins, HTTP methods, and credentials settings.
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow CORS on all endpoints
                        .allowedOrigins("http://localhost:5173") // Specify your frontend address
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Specify allowed HTTP methods
                        .allowCredentials(true);
            }
        };
    }
}
