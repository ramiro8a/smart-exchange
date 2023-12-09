package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.security.SessionInfo;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new ProviderException(ErrorMsj.UNAUTHORIZED.getMsj(),
                    ErrorMsj.UNAUTHORIZED.getCod(),
                    HttpStatus.UNAUTHORIZED);
        }
        return (SessionInfo) authentication.getPrincipal();
    }
}
