package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import com.qhatuna.exchange.app.rest.response.OperacionResponse;
import com.qhatuna.exchange.domain.model.Cliente;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
public class NotificacionService {
    private final SimpMessagingTemplate messagingtemplate;

    public void notifValidarCLiente(Cliente cliente){
        log.info("enviando notificacion_"+"/topic/valida-cliente/" + "OPERADOR"+":   Validación datos de cliente "+cliente.getNroDocumento());
        messagingtemplate.convertAndSend("/topic/valida-cliente/" + "OPERADOR",
                new NotificacionResponse("Validación datos de cliente "+cliente.getNroDocumento(), "validaDatosCliente", cliente.getNroDocumento()));
    }

    public void cambioEstadoOperacion(OperacionResponse operacion){
        log.info("enviando notificacion_"+"/topic/cambio-estado-operacion/" + operacion.cliente().usuarioId());
        messagingtemplate.convertAndSend("/topic/cambio-estado-operacion/" + operacion.cliente().usuarioId(), operacion);
    }
}
