package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.RegistroRequest;
import com.qhatuna.exchange.app.rest.request.UsuarioRequest;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import com.qhatuna.exchange.app.security.JwtProvider;
import com.qhatuna.exchange.commons.constant.ConstValues;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import com.qhatuna.exchange.domain.model.Rol;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.RolRepository;
import com.qhatuna.exchange.domain.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@AllArgsConstructor
@Service
public class UsuarioService {
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final CorreoService correoService;
    private final HttpServletRequest servletRequest;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponse registraCliente(RegistroRequest request){
        if(usuarioRepository.existePorCorreo(request.correo().trim())){
            throw new ProviderException(ErrorMsj.CORREO_EXISTE.getMsj(),ErrorMsj.CORREO_EXISTE.getCod(), HttpStatus.BAD_REQUEST);
        }
        Optional<Rol> rol = rolRepository.buscaRolCliente();
        String tokenConfirma =jwtProvider.generateTokenConfirm(request.correo().trim());
        correoService.sendSimpleMessage(
                request.correo(),
                ConstValues.ASUNTO_VERIFICA,
                String.format(ConstValues.CUERPO_VERIFICA, request.nombres(),recuperaLinkConfirm(tokenConfirma), "AQUI")
        );
        if(rol.isEmpty()) throw new ProviderException(ErrorMsj.NO_HAY_ROL.getMsj(), ErrorMsj.NO_HAY_ROL.getCod());
        Usuario usuario = Usuario.builder()
                .usuario(request.correo().trim())
                .correo(request.correo().trim())
                .correoValidado(false)
                .bloqueado(false)
                .password(passwordEncoder.encode(request.password().trim()))
                .roles(Set.of(rol.get()))
                .build();
        usuario = usuarioRepository.save(usuario);
        return Usuario.aResponse(usuario);
    }

    public void confirmaUsuario(String token){
        try {
            String nombreUsuario = jwtProvider.getNombreUsuarioFromToken(token);
            Optional<Usuario> usuarioOptional = usuarioRepository.buscaPorUsuario(nombreUsuario);
            if(usuarioOptional.isPresent()){
                Usuario usuario = usuarioOptional.get();
                usuario.setCorreoValidado(true);
                usuarioRepository.save(usuario);
            }else {
                throw new ProviderException(ErrorMsj.USUARIO_VACIO.getMsj(),ErrorMsj.USUARIO_VACIO.getCod(), HttpStatus.FORBIDDEN);
            }
        }catch (Exception ex){
            throw new ProviderException(
                    Util.getExceptionMsg(ex),
                    ErrorMsj.CONFIRM_ERROR.getMsj(),
                    ErrorMsj.CONFIRM_ERROR.getCod(),
                    HttpStatus.FORBIDDEN
            );
        }
    }
    public UsuarioResponse crea(UsuarioRequest request){
        return null;
    }

    public List<UsuarioResponse> recuperaTodo(){
        return Collections.emptyList();
    }

    public void elimina(Long id){

    }

    public UsuarioResponse actualiza(Long id, UsuarioRequest request){
        return null;
    }

    public void actualizaPassword(Long id, String request){

    }

    private String recuperaLinkConfirm (String token){
        return ServletUriComponentsBuilder.fromRequestUri(servletRequest).replacePath(null).build().toUriString()
                +"/auth/confirma/"+token;
    }

}
