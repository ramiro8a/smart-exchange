package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.RegistroRequest;
import com.qhatuna.exchange.app.rest.response.AutenticationResponse;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import com.qhatuna.exchange.domain.service.AutenticacionService;
import com.qhatuna.exchange.domain.service.UsuarioService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/auth")
@Tag(name = "Autenticacion", description = "Este controlador expone los servicio de authenticacion y registro")
public class AutenticacionController {
    @Autowired
    private AutenticacionService service;
    @Autowired
    private UsuarioService usuarioService;
    @PostMapping(path = "/login", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<AutenticationResponse> autenticacion(
            @RequestHeader("Authorization") String basicAuth
    ) {
        return new ResponseEntity<>(service.auth(basicAuth), HttpStatus.CREATED);
    }

    @PostMapping(path = "/registro", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<UsuarioResponse> registraCliente(
            @Parameter(description = "Datos de cliente a registrar", required = true, content = @Content(schema = @Schema(implementation = RegistroRequest.class)))
            @Valid @NotNull @RequestBody RegistroRequest request) {
        return new ResponseEntity<>(usuarioService.registraCliente(request), HttpStatus.CREATED);
    }

    @GetMapping(path = "/confirmer/{token}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<String> confirmaCliente(@PathVariable String token) {
        System.out.println("token = " + token);
        usuarioService.confirmaUsuario(token);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
