package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.RegistroRequest;
import com.qhatuna.exchange.app.rest.request.UsuarioRequest;
import com.qhatuna.exchange.app.rest.request.UsuariosAuxRequest;
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
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;

@AllArgsConstructor
@Service
public class UsuarioService {
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final CorreoService correoService;
    private final HttpServletRequest servletRequest;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public void tareasMantenimientoUsuario(UsuariosAuxRequest request){
        Usuario usuario = recuperaPorCorreo(request.email().trim());
        String tokenConfirma =jwtProvider.generateTokenConfirm(usuario.getCorreo());
        if(request.opc().equals(1)){
            //olvide contrasena
            correoService.sendSimpleMessage(
                    usuario.getCorreo(),
                    ConstValues.ASUNTO_PASSWORD,
                    String.format(ConstValues.CUERPO_PASSWORD,recuperaLinkPassword(tokenConfirma), "AQUI")
            );
        } else if (request.opc().equals(2)) {
            correoService.sendSimpleMessage(
                    usuario.getCorreo(),
                    ConstValues.ASUNTO_VERIFICA,
                    String.format(ConstValues.CUERPO_VERIFICA,recuperaLinkConfirm(tokenConfirma), "AQUI")
            );
        }else{
            throw new ProviderException(ErrorMsj.OPCION_NO_EXISTE.getMsj(),ErrorMsj.OPCION_NO_EXISTE.getCod(), HttpStatus.FORBIDDEN);
        }
    }
    public UsuarioResponse registraCliente(RegistroRequest request){
        if(usuarioRepository.existePorCorreo(request.correo().trim())){
            throw new ProviderException(ErrorMsj.CORREO_EXISTE.getMsj(),ErrorMsj.CORREO_EXISTE.getCod(), HttpStatus.BAD_REQUEST);
        }
        Optional<Rol> rol = rolRepository.buscaRolCliente();
        String tokenConfirma =jwtProvider.generateTokenConfirm(request.correo().trim());
        correoService.sendSimpleMessage(
                request.correo(),
                ConstValues.ASUNTO_VERIFICA,
                String.format(ConstValues.CUERPO_VERIFICA,recuperaLinkConfirm(tokenConfirma), "AQUI")
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
    public UsuarioResponse crea(UsuarioRequest request) {
        Usuario usuario = Usuario.builder()
                .estado(request.estado())
                .usuario(request.usuario())
                .correo(request.correo())
                .bloqueado(request.bloqueado())
                .inicio(request.inicio())
                .fin(request.fin())
                .password(passwordEncoder.encode(request.password().trim()))
                .build();
        List<Rol> roles = rolRepository.findAllById(request.roles());
        usuario.setRoles(Set.copyOf(roles));
        return Usuario.aResponse(usuarioRepository.save(usuario));
    }


    public List<UsuarioResponse> recuperaTodo(){
        List<Usuario> usuarios = usuarioRepository.recuperaTodo();
        List<UsuarioResponse> response = new ArrayList<>();
        usuarios.forEach(item->{
            if(!item.esCliente())
                response.add(Usuario.aResponse(item));
        });
        return response;
    }

    public void elimina(Long id){

    }

    public UsuarioResponse actualiza(Long id, UsuarioRequest request){
        return null;
    }

    public UsuarioResponse recuperaUsuarioResponsePorId(Long id){
        return Usuario.aResponse(recuperaUsuarioPorId(id));
    }

    public void actualizaPassword(Long id, String request){

    }

    private String recuperaLinkConfirm (String token){
        return ServletUriComponentsBuilder.fromRequestUri(servletRequest).replacePath(null).build().toUriString()
                +"/confirma/"+token;
    }

    private String recuperaLinkPassword (String token){
        return ServletUriComponentsBuilder.fromRequestUri(servletRequest).replacePath(null).build().toUriString()
                +"/password-reset/"+token;
    }

    public List<Usuario> recuperaOperadoresActivos(){
        return usuarioRepository.buscaUsuarioPorNombreDeRol("OPERADOR");
    }

    public List<UsuarioResponse> recuperaOperadores(){
        List<Usuario> usuarios = usuarioRepository.buscaUsuarioPorNombreDeRol("OPERADOR");
        return usuarios.stream().map(Usuario::aResponse).toList();
    }

    public Usuario recuperaUsuarioPorId(Long id){
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CLIENTE_NOEXISTE.getMsj(),
                        ErrorMsj.CLIENTE_NOEXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }

    public Usuario recuperaPorCorreo(String correo){
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CORREO_NO_EXISTE.getMsj(),
                        ErrorMsj.CORREO_NO_EXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }

}
