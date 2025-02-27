package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.RegistroRequest;
import com.qhatuna.exchange.app.rest.request.ResetPassRequest;
import com.qhatuna.exchange.app.rest.request.UsuariosAuxRequest;
import com.qhatuna.exchange.app.rest.response.*;
import com.qhatuna.exchange.domain.model.Empresa;
import com.qhatuna.exchange.domain.provider.sunat.SunatProvider;
import com.qhatuna.exchange.domain.service.*;
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

import java.util.List;

@RestController
@RequestMapping(path = "/auth")
@Tag(name = "Autenticacion", description = "Este controlador expone los servicio de authenticacion y registro")
public class AutenticacionController {
    @Autowired
    private AutenticacionService service;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private EmpresaService empresaService;
    @Autowired
    private TipoCambioService tcService;
    @Autowired
    private OperacionService operacionService;
    @Autowired
    private SunatProvider sunatProvider;

    @PostMapping(path = "/login", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<AutenticationResponse> autenticacion(
            @RequestHeader("Authorization") String basicAuth
    ) {
        return new ResponseEntity<>(service.auth(basicAuth), HttpStatus.OK);
    }

    @PostMapping(path = "/registro", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<UsuarioResponse> registraCliente(
            @Parameter(description = "Datos de cliente a registrar", required = true, content = @Content(schema = @Schema(implementation = RegistroRequest.class)))
            @Valid @NotNull @RequestBody RegistroRequest request) {
        return new ResponseEntity<>(usuarioService.registraCliente(request), HttpStatus.CREATED);
    }

    @PostMapping(path = "/cuentas-aux", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> cuentasAux(
            @Parameter(description = "Datos de la accion a ejecutar", required = true, content = @Content(schema = @Schema(implementation = RegistroRequest.class)))
            @Valid @NotNull @RequestBody UsuariosAuxRequest request) {
        usuarioService.tareasMantenimientoUsuario(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/confirmer/{token}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<String> confirmaCliente(@PathVariable String token) {
        usuarioService.confirmaUsuario(token);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PatchMapping(path = "/reset-pass", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> resetPass(
            @Valid @NotNull @RequestBody ResetPassRequest request
    ) {
        usuarioService.resetPasswordClient(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/empresa-public", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Empresa> recuperaEmpresa() {
        return new ResponseEntity<>(empresaService.recuperaEmpresa(), HttpStatus.OK);
    }

    @GetMapping(path = "/tipo-cambio", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<TCPublicoResponse>> recupertaTCPublico() {
        return new ResponseEntity<>(tcService.recuperaTCPulico(), HttpStatus.OK);
    }

    @GetMapping(path = "/v2/tipo-cambio", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<TipoCambioResponseV2> recupertaTCPublicoV2() {
        return new ResponseEntity<>(tcService.recuperaTCPulicoV2(), HttpStatus.OK);
    }

    @GetMapping(path = "/v2/tipo-cambio-lista", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<TipoCambioResponse>> recupertaTCPublicoV2Lista() {
        return new ResponseEntity<>(tcService.recuperaTCTodos(), HttpStatus.OK);
    }

    @GetMapping(path = "/ahorro/{opcion}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<AhorroResponse>> recupertaAhorroPublico(@PathVariable Integer opcion) {
        return new ResponseEntity<>(operacionService.recuperAhorroPublico(opcion), HttpStatus.OK);
    }
    @GetMapping(path = "/test-factura", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> testFactura() {
        try {
            sunatProvider.enviaFacturaTest();
        }catch (Exception ex){
            System.out.println(ex.getMessage());
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
