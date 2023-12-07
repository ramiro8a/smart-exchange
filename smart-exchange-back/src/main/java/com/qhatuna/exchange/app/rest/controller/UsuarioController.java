package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import com.qhatuna.exchange.app.rest.request.UsuarioRequest;
import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import com.qhatuna.exchange.domain.service.ClienteService;
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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/usuario")
@Tag(name = "Usuarios", description = "Este controlador expone los servicio de usuario")
@Validated
public class UsuarioController {
    @Autowired
    private UsuarioService service;
    @Autowired
    private ClienteService clienteService;

    @PostMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<UsuarioResponse> creaUsuario(
            @Parameter(description = "Datos de usuario a crear", required = true, content = @Content(schema = @Schema(implementation = UsuarioRequest.class)))
            @Valid @NotNull @RequestBody UsuarioRequest request) {
        return new ResponseEntity<>(service.crea(request), HttpStatus.CREATED);
    }

    @GetMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<UsuarioResponse>> recuperaTodo() {
        return new ResponseEntity<>(service.recuperaTodo(), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> eliminaUsuario(
            @Parameter(description = "id del usuario a eliminar", required = true) @NotNull() @PathVariable final Long id
    ) {
        service.elimina(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping(path = "/{id}", produces = {
            MediaType.APPLICATION_JSON_VALUE }, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UsuarioResponse> actualiza(
            @Parameter(description = "Id del usuario a actualizar", required = true) @NotNull @PathVariable final Long id,
            @Parameter(description = "Datos de usuario", required = true, content = @Content(schema = @Schema(implementation = UsuarioRequest.class)))
            @Valid @RequestBody UsuarioRequest request) {
        return new ResponseEntity<>(service.actualiza(id, request), HttpStatus.OK);
    }

    @PatchMapping(path = "/{id}", produces = {
            MediaType.APPLICATION_JSON_VALUE }, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> actualizaPassword(
            @Parameter(description = "Id del usuario a actualizar", required = true) @NotNull @PathVariable final Long id,
            @Parameter(description = "Datos de usuario", required = true, content = @Content(schema = @Schema(implementation = String.class)))
            @Valid @RequestBody String request) {
        service.actualizaPassword(id, request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/cliente", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ClienteResponse> creaCliente(
            @Parameter(description = "Datos de tipo cambio a crear", required = true, content = @Content(schema = @Schema(implementation = ClienteRequest.class)))
            @Valid @NotNull @RequestBody ClienteRequest request) {
        return new ResponseEntity<>(clienteService.crea(request), HttpStatus.CREATED);
    }
}
