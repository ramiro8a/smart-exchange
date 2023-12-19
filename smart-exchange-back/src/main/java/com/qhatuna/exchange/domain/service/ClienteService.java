package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.ClienteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ClienteService {
    private final ClienteRepository repository;
    private final SessionInfoService sessionInfoService;
    private final NotificacionService notificacionService;
    private final SunatValidacionService sunatValidacionService;

    public ClienteResponse crea(ClienteRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        boolean clienteValido = sunatValidacionService.datosValidos(request);
        Cliente cliente = Cliente.builder()
                .tipoDocumento(request.tipoDocumento())
                .nroDocumento(request.nroDocumento())
                .celular(request.celular())
                .telefono(request.telefono())
                .nombres(request.nombres())
                .paterno(request.paterno())
                .materno(request.materno())
                .usuarioId(usuario.getId())
                .validado(clienteValido)
                .build();
        cliente = repository.save(cliente);
        if(!clienteValido){
            notificacionService.notifValidarCLiente(cliente);
        }
        return Cliente.aResponse(cliente);
    }
}
