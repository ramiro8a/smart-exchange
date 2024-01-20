package com.qhatuna.exchange.commons.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicLong;

public class Util {
    private Util(){
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
    private static final ObjectMapper objectMapper = createObjectMapper();
    private static final AtomicLong counter = new AtomicLong(0);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");

    public static String objectToString(Object data, boolean pretty){
        try {
            ObjectWriter ow = objectMapper.writer();
            if(pretty)
                ow = objectMapper.writer().withDefaultPrettyPrinter();
            return ow.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new ProviderException(getExceptionMsg(e),ErrorMsj.PROCESSING_OBJECT.getMsj(), ErrorMsj.PROCESSING_OBJECT.getCod());
        }
    }

    public static <T> T stringToObject(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new ProviderException(getExceptionMsg(e), ErrorMsj.PROCESSING_OBJECT.getMsj(), ErrorMsj.PROCESSING_OBJECT.getCod());
        }
    }


    public static String getExceptionMsg(Exception ex){
        return ex.getCause()==null?ex.getMessage():ex.getCause().getMessage();
    }

    public static String dateTimeToString(LocalDateTime data){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return data.format(formatter);
    }

    public static String dateTimeToStringYYYY_MM_DD(LocalDateTime data){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return data.format(formatter);
    }

    public static String generadorTicket() {
        LocalDateTime now = LocalDateTime.now();
        String timestamp = now.format(formatter);
        long count = counter.incrementAndGet();
        return timestamp + String.format("%04d", count);
    }

    public static String aHoraMinuto(LocalTime data) {
        DateTimeFormatter formateador = DateTimeFormatter.ofPattern("HH:mm");
        return data.format(formateador);
    }

    private static ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        return mapper;
    }

    public static String recuperaPathComprobantes() {
        String jarDir = new File(Util.class.getProtectionDomain().getCodeSource().getLocation().getPath()).getParent();
        String comprobantesDirPath = jarDir + File.separator + "comprobantes";
        String monthDirName = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        return comprobantesDirPath + File.separator + monthDirName+File.separator;
    }

    public static String convertirImageABase64(String imagePath) {
        try{
            File file = new File(imagePath);
            byte[] fileContent = Files.readAllBytes(file.toPath());
            return Base64.getEncoder().encodeToString(fileContent);
        }catch (Exception e){
            throw new ProviderException(ErrorMsj.NOHAY_COMPROBANTE.getMsj(),ErrorMsj.NOHAY_COMPROBANTE.getCod());
        }
    }

    public static String guardaComprobante(String base64, String path, String nombre){
        File directory = new File(path);
        if (!directory.exists()) {
            boolean wasDirectoryMade = directory.mkdirs();
            if (!wasDirectoryMade) {
                throw new ProviderException(ErrorMsj.PATH_COMPROBANTE.getMsj(),ErrorMsj.PATH_COMPROBANTE.getCod());
            }
        }
        String[] partes = base64.split(",");
        String imageString = partes[1];
        String extension = switch (partes[0]) {
            case "data:image/jpeg;base64" -> "jpeg";
            case "data:image/png;base64" -> "png";
            default -> "jpg";
        };
        byte[] imagenBytes = Base64.getDecoder().decode(imageString);

        try (InputStream is = new ByteArrayInputStream(imagenBytes)) {
            BufferedImage bufferedImage = ImageIO.read(is);
            File archivo = new File(path + nombre + "." + extension);
            ImageIO.write(bufferedImage, extension, archivo);
            return archivo.getAbsolutePath();
        } catch (IOException e) {
            throw new ProviderException(ErrorMsj.GUARDAR_COMPROBANTE.getMsj(),ErrorMsj.GUARDAR_COMPROBANTE.getCod());
        }
    }
}
