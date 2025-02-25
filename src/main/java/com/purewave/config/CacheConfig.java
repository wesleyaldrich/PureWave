package com.purewave.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * CacheConfig is a configuration class responsible for setting up
 * a cache mechanism using Caffeine caching library.
 * It defines the Caffeine configuration and provides a CacheManager bean.
 */
@Configuration
public class CacheConfig {

    /**
     * Configures and provides a Caffeine caching instance.
     * The cache is set to expire entries 30 days after being written.
     *
     * @return a Caffeine instance with the specified configuration.
     */
    @Bean
    public Caffeine caffeineConfig() {
        return Caffeine.newBuilder().expireAfterWrite(30, TimeUnit.DAYS);
    }

    /**
     * Creates and configures a CacheManager bean using Caffeine caching library.
     * The CacheManager is responsible for managing and providing access
     * to caches defined with the specified Caffeine configuration.
     *
     * @param caffeine the Caffeine instance containing cache configuration details
     * @return a CacheManager configured with the provided Caffeine settings
     */
    @Bean
    public CacheManager cacheManager(Caffeine caffeine) {
        CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
        caffeineCacheManager.setCaffeine(caffeine);
        return caffeineCacheManager;
    }
}