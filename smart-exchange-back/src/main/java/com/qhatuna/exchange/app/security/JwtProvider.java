package com.qhatuna.exchange.app.security;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Slf4j
@Service
public class JwtProvider {
    @Value("${jwt.secret:hola}")
    private String secret;

    @Value("${jwt.expiration:30}")
    private int expirationMinute;
    @Value("${jwt.refresh.expiration:45}")
    private int refreshExpirationMinute;
    @Value("${jwt.confirm.expiration:60}")
    private int expirationConfirmMinute;

    public String generateToken(Authentication authentication) {
        SessionInfo usuarioPrincipal = (SessionInfo) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(usuarioPrincipal.getUsername())
                .claim("roles", usuarioPrincipal.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + expirationMinute * 60 *1000L))
                .signWith(getSecret(secret))
                .compact();
    }
    public String generateRefreshToken(Authentication authentication) {
        SessionInfo usuarioPrincipal = (SessionInfo) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(usuarioPrincipal.getUsername())
                .claim("roles", usuarioPrincipal.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + refreshExpirationMinute * 60 *1000L))
                .signWith(getSecret(secret))
                .compact();
    }
    public String generateTokenConfirm(String usuario) {
        Date desde = new Date();
        Date hasta = new Date(new Date().getTime() + expirationConfirmMinute * 60 *1000L);
        return Jwts.builder()
                .setSubject(usuario)
                .setIssuedAt(desde)
                .setExpiration(hasta)
                .signWith(getSecret(secret))
                .compact();
    }

    public String getNombreUsuarioFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSecret(secret))
                .build().parseClaimsJws(token).getBody().getSubject();
    }

    private Key getSecret(String secret){
        byte[] secretBytes = Decoders.BASE64URL.decode(secret);
        return Keys.hmacShaKeyFor(secretBytes);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username=getNombreUsuarioFromToken(token);
        return (username.equals(userDetails.getUsername())&& !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token){
        return getExpiration(token).before(new Date());
    }

    public <T> T getClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims=getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Date getExpiration(String token){
        return getClaim(token, Claims::getExpiration);
    }
    private Claims getAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getKey() {
        byte[] keyBytes=Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
