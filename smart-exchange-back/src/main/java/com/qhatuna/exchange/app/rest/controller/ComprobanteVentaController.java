package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.response.ComprobanteResponse;
import com.qhatuna.exchange.app.rest.response.ComprobanteVentaResponse;
import com.qhatuna.exchange.app.rest.response.UsuarioResponse;
import com.qhatuna.exchange.domain.service.ComprobanteVentaService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/comprobante-venta")
@Tag(name = "Comprobantes de venta", description = "Este controlador expone los servicio de comprobantes de venta")
@Validated
public class ComprobanteVentaController {
    @Autowired
    private ComprobanteVentaService service;

    @GetMapping(path = "/{operacionId}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ComprobanteVentaResponse> recuperaComprobantePorOperacionId(
            @Parameter(description = "id de la operacion", required = true) @NotNull() @PathVariable final Long operacionId
    ) {
        return new ResponseEntity<>(service.recuperaPorOperacionId(operacionId), HttpStatus.OK);
    }

    @PatchMapping(path = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ComprobanteVentaResponse> reEnvioFacturaSunat(
            @Parameter(description = "id de comprobante de venta", required = true) @NotNull() @PathVariable final Long id
    ) {
        return new ResponseEntity<>(service.reEnviaFacturaSunat(id), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/{tipo}", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ComprobanteResponse> documentosSunatPorId(
            @Parameter(description = "id del comprobante de venta", required = true) @NotNull() @PathVariable final Long id,
            @Parameter(description = "id del comprobante de venta", required = true) @NotNull() @PathVariable final Integer tipo
    ) {
        return new ResponseEntity<>(service.recuperaArchivosSunat(id, tipo), HttpStatus.OK);
    }
}
