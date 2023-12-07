package com.qhatuna.exchange.app.rest.controller;

import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import com.qhatuna.exchange.domain.service.ClienteService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/cliente")
@Tag(name = "Cliente", description = "Este controlador expone los servicio de clientes")
@Validated
public class ClienteController {
    @Autowired
    private ClienteService service;


}
