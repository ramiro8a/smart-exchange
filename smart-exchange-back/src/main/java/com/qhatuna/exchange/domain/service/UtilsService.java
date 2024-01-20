package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import com.qhatuna.exchange.commons.utils.Util;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.model.Dia;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.ClienteRepository;
import com.qhatuna.exchange.domain.repository.DiaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@AllArgsConstructor
@Service
public class UtilsService {
    private final ClienteRepository clienteRepository;
    private final SessionInfoService sessionInfoService;
    private final DiaRepository diaRepository;
    public List<NotificacionResponse> notificaciones(){
        List<NotificacionResponse> lista = new ArrayList<>();
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        if(usuario.esCliente()){
            verificaHorario(lista);
            Optional<Cliente> cliente = clienteRepository.findByUsuarioId(usuario.getId());
            if (cliente.isEmpty() || cliente.get().getNombres().isBlank()) {
                lista.add(new NotificacionResponse("Datos personales", "datosPersonales", null));
            }
        }
        return lista;
    }

    public NotificacionResponse verificaHorario(){
        List<NotificacionResponse> lista = new ArrayList<>();
        verificaHorario(lista);
        if(lista.isEmpty()){
            return null;
        }else {
            return lista.get(0);
        }
    }


    private void verificaHorario(List<NotificacionResponse> lista){
        LocalDate fechaActual = LocalDate.now();
        DayOfWeek diaDeLaSemana = fechaActual.getDayOfWeek();
        int numeroSemana= diaDeLaSemana.getValue();
        Optional<Dia> diaOptional = diaRepository.findById(Long.valueOf((numeroSemana)));
        if(diaOptional.isPresent()){
            Dia dia = diaOptional.get();
            if(dia.isLaboral()){
                LocalTime ahora = LocalTime.now();
                if (!(ahora.isAfter(dia.getHorario().getDesde()) && ahora.isBefore(dia.getHorario().getHasta()))){
                    String mensaje = "Hoy nuestro horario de atención es de "+Util.aHoraMinuto(dia.getHorario().getDesde())+" a "+Util.aHoraMinuto(dia.getHorario().getHasta())+". Si gusta puede seguir realizando sus operaciónes, lo atenderemos lo más antes posible";
                    lista.add(new NotificacionResponse("Horario de atención", "horarioAtencion", mensaje));
                }
            }else{
                String mensaje = "Estimado cliente , le informamos que hoy no estamos operando. Si gusta puede seguir realizando sus operaciónes, lo atenderemos lo más antes posible";
                lista.add(new NotificacionResponse("Horario de atención", "horarioAtencion", mensaje));
            }
        }
    }


    public void saveBase64AsImageFile(String base64String, String path, String fileName) throws IOException {
        String[] parts = base64String.split(",");
        String imageString = parts[1];
        String extension = switch (parts[0]) {
            case "data:image/jpeg;base64" -> "jpeg";
            case "data:image/png;base64" -> "png";
            default -> "jpg";
        };
        byte[] imageBytes = Base64.getDecoder().decode(imageString);

        try (InputStream is = new ByteArrayInputStream(imageBytes)) {
            BufferedImage bufferedImage = ImageIO.read(is);
            File outputFile = new File(path + fileName + "." + extension);
            ImageIO.write(bufferedImage, extension, outputFile);
        } catch (IOException e) {
            throw new IOException("Error al guardar la imagen", e);
        }
    }
}
