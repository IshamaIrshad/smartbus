
package com.smartbus.backend.config;

import com.smartbus.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // =========================
    // CORS CONFIGURATION
    // =========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:3000", "http://localhost:3001")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // CORS PREFLIGHT
                        // =========================
                        .requestMatchers(
                                HttpMethod.OPTIONS, "/**"
                        ).permitAll()

                        // =========================
                        // PUBLIC
                        // =========================
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/roles"
                        ).permitAll()

                        // =========================
                        // ADMIN
                        // =========================
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // STAFF MANAGEMENT - ADMIN ONLY
                        // =========================
                        .requestMatchers(
                                "/api/users/**",
                                "/api/drivers/**",
                                "/api/conductors/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // BUS
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/buses"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/buses/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/buses/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/buses/**"
                        ).authenticated()

                        // =========================
                        // ROUTE
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/routes"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/routes/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/routes/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/routes/**"
                        ).authenticated()

                        // =========================
                        // ROUTE STOP
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/route-stops"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/route-stops/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/route-stops/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/route-stops/**"
                        ).authenticated()

                        // =========================
                        // SCHEDULE
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/schedules"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/schedules/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/schedules/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/schedules/**"
                        ).authenticated()

                        // =========================
                        // SEAT
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/seats"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/seats/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/seats/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/seats/**"
                        ).authenticated()

                        // =========================
                        // TICKET PRICE
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/ticket-prices"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/ticket-prices/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/ticket-prices/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/ticket-prices/**"
                        ).authenticated()

                        // =========================
                        // CONDUCTOR ASSIGNMENTS
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/conductor-assignments"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/conductor-assignments/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/conductor-assignments/my-schedules"
                        ).hasRole("CONDUCTOR")

                        .requestMatchers(
                                HttpMethod.GET, "/api/conductor-assignments/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // PASSENGER PROFILE
                        // =========================
                        .requestMatchers(
                                HttpMethod.GET, "/api/passengers/profile"
                        ).hasRole("PASSENGER")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/passengers/**"
                        ).hasRole("PASSENGER")

                        // =========================
                        // PASSENGER MANAGEMENT
                        // =========================
                        .requestMatchers(
                                HttpMethod.GET, "/api/passengers"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/passengers/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.POST, "/api/passengers"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/passengers/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // PASSENGER BOOKING
                        // =========================
                        .requestMatchers(
                                "/api/passenger/**"
                        ).hasRole("PASSENGER")

                        .requestMatchers(
                                "/api/tickets/booking/**"
                        ).hasRole("PASSENGER")

                        // =========================
                        // BOOKED SEATS
                        // =========================
                        .requestMatchers(
                                HttpMethod.GET, "/api/bookings/schedule/**"
                        ).hasAnyRole("PASSENGER", "ADMIN")

                        // =========================
                        // BOOKING
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST, "/api/bookings"
                        ).hasRole("PASSENGER")

                        .requestMatchers(
                                HttpMethod.GET, "/api/bookings"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET, "/api/bookings/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/bookings/**"
                        ).hasRole("ADMIN")

                        // =========================
                        // DRIVER
                        // =========================
                        .requestMatchers(
                                "/api/driver/**"
                        ).hasRole("DRIVER")

                        // =========================
                        // CONDUCTOR
                        // =========================
                        .requestMatchers(
                                "/api/conductor/**"
                        ).hasRole("CONDUCTOR")

                        // =========================
                        // OTHER AUTHENTICATED REQUESTS
                        // =========================
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}