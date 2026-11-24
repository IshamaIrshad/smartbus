 package com.smartbus.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        System.out.println("\n========== JWT DEBUG ==========");
        System.out.println("REQUEST: " + request.getMethod() + " " + requestPath);
        System.out.println("AUTHORIZATION HEADER PRESENT: "
                + (authHeader != null && authHeader.startsWith("Bearer ")));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("JWT: No Bearer token found.");
            System.out.println("================================\n");
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);

        try {
            String email = jwtService.extractUsername(jwtToken);
            System.out.println("JWT EMAIL: " + email);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                System.out.println("DATABASE USER LOADED: "
                        + userDetails.getUsername());
                System.out.println("JWT AUTHORITIES: "
                        + userDetails.getAuthorities());

                if (jwtService.isTokenValid(jwtToken, email)) {

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authenticationToken);

                    System.out.println("JWT AUTHENTICATED: "
                            + authenticationToken.isAuthenticated());
                    System.out.println("SECURITY CONTEXT AUTHORITIES: "
                            + SecurityContextHolder.getContext()
                            .getAuthentication().getAuthorities());

                } else {
                    System.out.println("JWT INVALID: Token validation failed.");
                }
            } else {
                System.out.println("JWT: Email is missing or request is already authenticated.");
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getClass().getSimpleName()
                    + " - " + e.getMessage());
        }

        System.out.println("================================\n");

        filterChain.doFilter(request, response);
    }
}

