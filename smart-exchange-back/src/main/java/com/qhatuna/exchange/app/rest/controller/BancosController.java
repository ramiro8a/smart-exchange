package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.BancoRequest;
import com.qhatuna.exchange.app.rest.request.CuentaBancariaRequest;
import com.qhatuna.exchange.app.rest.response.BancoResponse;
import com.qhatuna.exchange.app.rest.response.CuentaBancariaResponse;
import com.qhatuna.exchange.app.rest.response.CuentasRegistradasResponse;
import com.qhatuna.exchange.domain.service.BancosService;
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
@RequestMapping(path = "/api/bancos")
@Tag(name = "Bancos", description = "Este controlador expone los servicio de bancos")
public class BancosController {
    @Autowired
    private BancosService service;

    @PostMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<BancoResponse> creaCuentaBancaria(
            @Parameter(description = "Datos de banco a crear", required = true, content = @Content(schema = @Schema(implementation = BancoRequest.class)))
            @Valid @NotNull @RequestBody BancoRequest request
    ) {
        return new ResponseEntity<>(service.creaBanco(request), HttpStatus.OK);
    }

    @GetMapping(path = "/transf-final/{operacionId}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<CuentaBancariaResponse>> recuperaBancosTransferenciaFinal(
            @PathVariable Long operacionId
    ) {
        return new ResponseEntity<>(service.recuperaBancosTransferenciaFinal(operacionId), HttpStatus.OK);
    }

    @GetMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<BancoResponse>> recuperaBancosActivos() {
        return new ResponseEntity<>(service.recuperaActivos(), HttpStatus.OK);
    }

    @GetMapping(path = "/todos", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<BancoResponse>> recuperaTodos() {
        return new ResponseEntity<>(service.recuperaTodos(), HttpStatus.OK);
    }

    @PostMapping(path = "/crea-cuenta-bancaria", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<CuentaBancariaResponse> creaCuentaBancaria(
            @Parameter(description = "Datos de cuenta bancaria a crear", required = true, content = @Content(schema = @Schema(implementation = CuentaBancariaRequest.class)))
            @Valid @NotNull @RequestBody CuentaBancariaRequest request
    ) {
        return new ResponseEntity<>(service.creaCuentaBancaria(request), HttpStatus.OK);
    }

    @PatchMapping(path = "/edita-cuenta-bancaria/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<CuentaBancariaResponse> editaCuentaBancaria(
            @PathVariable Long id,
            @Parameter(description = "Datos de cuenta bancaria a crear", required = true, content = @Content(schema = @Schema(implementation = CuentaBancariaRequest.class)))
            @Valid @NotNull @RequestBody CuentaBancariaRequest request
    ) {
        return new ResponseEntity<>(service.editaCuentaBancaria(id, request), HttpStatus.OK);
    }

    @GetMapping(path = "/cuenta-bancaria", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<CuentaBancariaResponse>> recuperaCuentasBancariasCliente(
    ) {
        return new ResponseEntity<>(service.recuperaCuentasBancariasCliente(), HttpStatus.OK);
    }

    @GetMapping(path = "/destino-transferencia/{banco}/{moneda}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<CuentaBancariaResponse> destinoTransferencia(
            @PathVariable Long banco,
            @PathVariable Integer moneda
    ) {
        return new ResponseEntity<>(service.recuperaDestinoTransferencia(banco, moneda), HttpStatus.OK);
    }

    @GetMapping(path = "/cuentas-bancarias-registradas/{monedaOrigen}/{monedaDestino}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<CuentasRegistradasResponse> recuperaCuentasRegistradasCliente(
            @PathVariable Integer monedaOrigen,
            @PathVariable Integer monedaDestino
    ) {
        return new ResponseEntity<>(service.recuperaCuentasRegistradasCliente(monedaOrigen, monedaDestino), HttpStatus.OK);
    }

    @PatchMapping(path = "/cuentas/{id}/{estado}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> habilitaDeshabilitaCuenta(
            @PathVariable Long id,
            @PathVariable boolean estado
    ) {
        service.habilitaDeshabilitaCuenta(id, estado);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping(path = "/{id}/{estado}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Void> habilitaDeshabilitaBanco(
            @PathVariable Long id,
            @PathVariable boolean estado
    ) {
        service.habilitaDeshabilitaBanco(id, estado);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
