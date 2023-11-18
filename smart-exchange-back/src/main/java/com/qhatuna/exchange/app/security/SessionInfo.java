package com.qhatuna.exchange.app.security;

import com.qhatuna.exchange.domain.model.Usuario;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

@Getter
@Setter
public class SessionInfo implements UserDetails {
    private Usuario ususario;

    public boolean correoValido() {
        return this.getUsusario().isCorreoValidado();
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.ususario.getRoles().stream()
                .map(rol -> new UserRole(rol.getNombre()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return this.ususario.getPassword();
    }

    @Override
    public String getUsername() {
        return this.ususario.getUsuario();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
