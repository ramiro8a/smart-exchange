package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.RolResponse;
import com.qhatuna.exchange.domain.model.Rol;
import com.qhatuna.exchange.domain.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RolService {
    @Autowired
    private RolRepository repository;

    public List<RolResponse> recuperaRolUsuarios(){
        List<Rol> roles = repository.recuperaTodo();
        List<RolResponse> response = new ArrayList<>();
        roles.forEach(item->{
            if(!item.getNombre().equalsIgnoreCase("CLIENTE"))
                response.add(Rol.aResponse(item));
        });
        return response;
    }
}
