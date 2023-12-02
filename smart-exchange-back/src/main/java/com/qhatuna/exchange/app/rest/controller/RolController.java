package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.response.RolResponse;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import com.qhatuna.exchange.domain.service.RolService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/rol")
@Tag(name = "Roles", description = "Este controlador expone los servicio de roles")
public class RolController {
    @Autowired
    private RolService service;

    @GetMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<RolResponse>> recuperaRolUsuarios() {
        return new ResponseEntity<>(service.recuperaRolUsuarios(), HttpStatus.OK);
    }
}
