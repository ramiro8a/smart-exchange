package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.UsuarioRequest;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UsuarioService {

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

}
