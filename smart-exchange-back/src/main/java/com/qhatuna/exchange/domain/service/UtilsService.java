package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.ClienteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UtilsService {
    private final ClienteRepository clienteRepository;
    private final SessionInfoService sessionInfoService;
    public List<NotificacionResponse> notificaciones(){
        List<NotificacionResponse> lista = new ArrayList<>();
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Optional<Cliente> cliente = clienteRepository.findByUsuarioId(usuario.getId());
        if (cliente.isEmpty() || cliente.get().getNombres().isBlank()) {
            lista.add(new NotificacionResponse("Datos personales", "datosPersonales"));
        }
        return lista;

    }
}
