package com.qhatuna.exchange.app.security;

import org.springframework.security.core.GrantedAuthority;

public class UserRole implements GrantedAuthority {
    private String role;

    public UserRole(String role) {
        this.role = role;
    }

    @Override
    public String getAuthority() {
        return role;
    }
}
