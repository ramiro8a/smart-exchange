package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.repository.ClienteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ClienteService {
    private final ClienteRepository repository;

    public ClienteResponse crea(ClienteRequest request){
        Cliente cliente = Cliente.builder()
                .tipoDocumento(request.tipoDocumento())
                .nroDocumento(request.nroDocumento())
                .celular(request.celular())
                .telefono(request.telefono())
                .nombres(request.nombres())
                .paterno(request.paterno())
                .materno(request.materno())
                .usuarioId(0L)
                .build();
        return Cliente.aResponse(repository.save(cliente));
    }
}
