package com.kamil.room_resrvation_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Allow credentials (cookies, authorization headers, etc.)
        config.addAllowedOrigin("http://localhost:5173"); // Allow specific origin
        config.addAllowedHeader("*"); // Allow all headers
        config.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        source.registerCorsConfiguration("/**", config); // Apply CORS settings to all endpoints
        return new CorsFilter(source);
    }
}