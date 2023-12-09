package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import com.qhatuna.exchange.app.rest.request.CuentaBancariaRequest;
import com.qhatuna.exchange.app.rest.response.BancoResponse;
import com.qhatuna.exchange.app.rest.response.CuentaBancariaResponse;
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

    @GetMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<BancoResponse>> recuperaBancosActivos() {
        return new ResponseEntity<>(service.recuperaActivos(), HttpStatus.OK);
    }

    @PostMapping(path = "/crea-cuenta-bancaria", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<CuentaBancariaResponse> creaCuentaBancaria(
            @Parameter(description = "Datos de cuenta bancaria a crear", required = true, content = @Content(schema = @Schema(implementation = CuentaBancariaRequest.class)))
            @Valid @NotNull @RequestBody CuentaBancariaRequest request
    ) {
        return new ResponseEntity<>(service.creaCuentaBancaria(request), HttpStatus.OK);
    }

    @GetMapping(path = "/cuenta-bancaria", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<CuentaBancariaResponse>> recuperaCuentasBancariasCliente(
    ) {
        return new ResponseEntity<>(service.recuperaCuentasBancariasCliente(), HttpStatus.OK);
    }
}
