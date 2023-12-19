package com.qhatuna.exchange.app.websocket;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public NotificacionResponse chat(@DestinationVariable String roomId, NotificacionResponse notificacionResponse) {
        System.out.println(notificacionResponse.descripcion());
        return notificacionResponse;
    }
}
