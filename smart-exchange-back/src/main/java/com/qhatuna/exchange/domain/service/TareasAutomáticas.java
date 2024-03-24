package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TareasAutomáticas {
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private TipoCambioService tipoCambioService;
    private Integer i =0;

    @Scheduled(cron = "0 */15 * * * *")///cada dos horas @Scheduled(cron = "0 0 */2 * * *")
    public void recuperaTipoCambio() {
        log.info("Recuperando tipo cambio");
        tipoCambioService.sincroniza();
    }

   // @Scheduled(cron = "*/5 * * * * *")
    public void enviaNotif() {
        log.info("Enviando un mensaje {}",i++);
        //this.template.convertAndSendToUser("OPERADOR", "/topic/notifications", "Saludo desde el backend");
        template.convertAndSend("/topic/notifications", "Saludos desde el backend: "+i);
    }

    //@Scheduled(cron = "*/5 * * * * *")
    public void enviarMensaje() {
        log.info("Enviando un mensaje {}",i++);
        template.convertAndSend("/topic/" + "ABC",
                new NotificacionResponse("hola", "metoso", ""));
    }

}
