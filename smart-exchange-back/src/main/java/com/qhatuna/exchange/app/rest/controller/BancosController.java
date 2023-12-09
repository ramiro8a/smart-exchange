package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.response.BancoResponse;
import com.qhatuna.exchange.domain.service.BancosService;
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
@RequestMapping(path = "/api/bancos")
@Tag(name = "Bancos", description = "Este controlador expone los servicio de bancos")
public class BancosController {
    @Autowired
    private BancosService service;

    @GetMapping(path = "", produces = {MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<List<BancoResponse>> recuperaBancosActivos() {
        return new ResponseEntity<>(service.recuperaActivos(), HttpStatus.OK);
    }
}
