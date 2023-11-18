package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.AutenticationResponse;
import com.qhatuna.exchange.app.security.JwtProvider;
import com.qhatuna.exchange.app.security.SessionInfo;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Service
@AllArgsConstructor
public class AutenticacionService {
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public AutenticationResponse auth(String basicAuth){
        try {
            if (!(StringUtils.hasText(basicAuth) && basicAuth.toLowerCase().startsWith("basic")))
                throw new ProviderException(ErrorMsj.BASIC_AUTH.getMsj(), ErrorMsj.BASIC_AUTH.getCod(), HttpStatus.BAD_REQUEST);
            String base64Credentials = basicAuth.substring("Basic".length()).trim();
            byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
            String credentials = new String(credDecoded, StandardCharsets.UTF_8);
            final String[] values = credentials.split(":", 2);
            Authentication authentication =
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(values[0], values[1]));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            SessionInfo user = (SessionInfo) authentication.getPrincipal();
            if(user.esCLiente() && !user.correoValido()){
                throw new ProviderException(
                        ErrorMsj.CORREO_NO_VALIDO.getMsj(),
                        ErrorMsj.CORREO_NO_VALIDO.getCod(),
                        HttpStatus.BAD_REQUEST
                );
            }
            return new AutenticationResponse("Bearer", jwtProvider.generateToken(authentication));
        }catch (ProviderException ex){
            throw ex;
        }catch (Exception ex){
            throw new ProviderException(
                    Util.getExceptionMsg(ex),
                    ErrorMsj.UNAUTHORIZED.getMsj(),
                    ErrorMsj.UNAUTHORIZED.getCod(),
                    HttpStatus.UNAUTHORIZED
            );
        }

    }
}
