package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.response.NotificacionResponse;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.repository.ClienteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
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
        if(usuario.esCliente()){
            Optional<Cliente> cliente = clienteRepository.findByUsuarioId(usuario.getId());
            if (cliente.isEmpty() || cliente.get().getNombres().isBlank()) {
                lista.add(new NotificacionResponse("Datos personales", "datosPersonales", null));
            }
        }
        return lista;
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
