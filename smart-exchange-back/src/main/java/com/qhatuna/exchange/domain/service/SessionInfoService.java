package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.security.SessionInfo;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SessionInfoService implements UserDetailsService {
    private final UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = repository.buscaPorUsuario(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not fournd"));
        SessionInfo sessionInfo = new SessionInfo();
        sessionInfo.setUsusario(usuario);
        return sessionInfo;
    }

    public SessionInfo getSession(){
    return null;
    }
}
