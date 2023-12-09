package com.qhatuna.exchange.app.security;

import java.io.IOException;

import com.qhatuna.exchange.commons.constant.ConstValues;
import com.qhatuna.exchange.domain.service.SessionInfoService;
import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.StringUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final SessionInfoService sessionInfoService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            final String token = getTokenFromRequest(request);
            if (token != null && isAuthenticated()) {
                authenticateUser(token, request);
            }
            filterChain.doFilter(request, response);
        } catch (JwtException ex) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
        }
    }

    private boolean isAuthenticated() {
        return SecurityContextHolder.getContext().getAuthentication() == null;
    }

    private void authenticateUser(String token, HttpServletRequest request) {
        String username = jwtProvider.getNombreUsuarioFromToken(token);
        UserDetails userDetails = sessionInfoService.loadUserByUsername(username);
        if (jwtProvider.isTokenValid(token, userDetails)) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            throw new JwtException("Token no válido");
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}

