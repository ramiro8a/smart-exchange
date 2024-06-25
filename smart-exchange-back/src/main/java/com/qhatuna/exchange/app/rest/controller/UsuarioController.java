package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.CambioPassword;
import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import com.qhatuna.exchange.app.rest.request.EditaUsuarioRequest;
import com.qhatuna.exchange.app.rest.request.UsuarioRequest;
import com.qhatuna.exchange.app.rest.response.AutenticationResponse;
import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import com.qhatuna.exchange.domain.service.AutenticacionService;
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
    @Autowired
    private AutenticacionService autenticacionService;

    @PostMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<UsuarioResponse> creaUsuario(
            @Parameter(description = "Datos de usuario a crear", required = true, content = @Content(schema = @Schema(implementation = UsuarioRequest.class)))
            @Valid @NotNull @RequestBody UsuarioRequest request) {
        return new ResponseEntity<>(service.crea(request), HttpStatus.CREATED);
    }

    @PostMapping(path = "/refresh-token", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<AutenticationResponse> refreshToken() {
        return new ResponseEntity<>(autenticacionService.refreshToken(), HttpStatus.CREATED);
    }

    @PatchMapping(path = "/edita/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<UsuarioResponse> editaUsuario(
            @Parameter(description = "id del usuario a editar", required = true) @NotNull() @PathVariable final Long id,
            @Parameter(description = "Datos de usuario a editar", required = true, content = @Content(schema = @Schema(implementation = UsuarioRequest.class)))
            @Valid @NotNull @RequestBody EditaUsuarioRequest request) {
        return new ResponseEntity<>(service.edita(id, request), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<UsuarioResponse> recuperaUsuarioPorId(
            @Parameter(description = "id del usuario a recuperar", required = true) @NotNull() @PathVariable final Long id
    ) {
        return new ResponseEntity<>(service.recuperaUsuarioResponsePorId(id), HttpStatus.OK);
    }

    @GetMapping(path = "/cliente", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ClienteResponse> recuperaClientePorSesion() {
        return new ResponseEntity<>(clienteService.recuperaClientePorSesion(), HttpStatus.OK);
    }

    @GetMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<UsuarioResponse>> recuperaTodo() {
        return new ResponseEntity<>(service.recuperaTodo(), HttpStatus.OK);
    }
    @GetMapping(path = "/operadores", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<UsuarioResponse>> recuperaOperadores() {
        return new ResponseEntity<>(service.recuperaOperadores(), HttpStatus.OK);
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

    @PatchMapping(path = "/cliente/{nroDocumento}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ClienteResponse> validaClienteSunat(
            @PathVariable final String nroDocumento) {
        return new ResponseEntity<>(clienteService.validaClienteSunat(nroDocumento), HttpStatus.OK);
    }

    @GetMapping(path = "/cliente/{page}/{size}/{tipo}/{valor}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<ClienteResponse>> listaClientes(
            @PathVariable final Integer page,
            @PathVariable final Integer size,
            @PathVariable final Integer tipo,
            @PathVariable final String valor
    ) {
        return new ResponseEntity<>(clienteService.lista(page, size, tipo, valor), HttpStatus.OK);
    }

    @PatchMapping(path = "/cliente/valida/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> validaCliente(@PathVariable final Long id) {
        clienteService.valida(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PatchMapping(path = "/cliente/estado/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> cambiaEstado(@PathVariable final Long id) {
        clienteService.cambiaEstadoHabilitadoDeshabilitado(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/bloqueo/{id}/{bloqueado}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> cambiaEstado(@PathVariable final Long id, @PathVariable final boolean bloqueado) {
        service.bloqueo(id,bloqueado);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/cambio-password", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> cambioPassword(@RequestBody CambioPassword request) {
        service.cambioPasswordUsuario(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
