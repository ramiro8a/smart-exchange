package com.qhatuna.exchange.commons.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.qhatuna.exchange.app.rest.response.ComprobanteResponse;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import io.github.project.openubl.xbuilder.content.catalogs.Catalog6;
import io.github.project.openubl.xbuilder.signature.CertificateDetails;
import io.github.project.openubl.xbuilder.signature.CertificateDetailsFactory;
import io.github.project.openubl.xbuilder.signature.XMLSigner;
import org.springframework.core.io.ClassPathResource;
import org.w3c.dom.Document;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.*;
import java.security.cert.X509Certificate;
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
    public static final DateTimeFormatter FECHA_COMPLETO = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter carpeta = DateTimeFormatter.ofPattern("yyyyMM");
    private static final String CERT_SUNAT = "certificateSUNAT.pem";

    public static String recuperaTipoDoocumentoSunat(Integer tipoDocLocal){
        return switch (tipoDocLocal) {
            case 1 -> "DNI";
            case 2 -> "RUC";
            case 3 -> "EXTRANJERIA";
            case 4 -> "PASAPORTE";
            default -> "999999";
        };
    }
    public static String recuperaTipoComprobante(String tipoDocumento){
        if((Catalog6.RUC.toString()).equals(tipoDocumento)){
            return "01";
        } else if ((Catalog6.DNI.toString()).equals(tipoDocumento)) {
            return "03";
        } else if ((Catalog6.EXTRANJERIA.toString()).equals(tipoDocumento)) {
            return "03";
        } else if ((Catalog6.PASAPORTE.toString()).equals(tipoDocumento)) {
            return "03";
        }else {
            return "000";
        }
    }

    public static String recuperaSerie(String tipoDocumento, String ticket){
        if((Catalog6.RUC.toString()).equals(tipoDocumento)){
            return "F"+ticket;
        } else if ((Catalog6.DNI.toString()).equals(tipoDocumento)) {
            return "B"+ticket;
        } else if ((Catalog6.EXTRANJERIA.toString()).equals(tipoDocumento)) {
            return "B"+ticket;
        } else if ((Catalog6.PASAPORTE.toString()).equals(tipoDocumento)) {
            return "B"+ticket;
        }else {
            return "000";
        }
    }

    public static Document firmarXml(String xml, String pathCertificado,String passCertificado, String firmadorId) {
        try {
            ClassPathResource resource = new ClassPathResource(pathCertificado);
            InputStream ksInputStream = resource.getInputStream();
            CertificateDetails certificate = CertificateDetailsFactory.create(ksInputStream, passCertificado);
            X509Certificate certificado = certificate.getX509Certificate();
            PrivateKey privateKey = certificate.getPrivateKey();
            return XMLSigner.signXML(xml, firmadorId, certificado, privateKey);
        }catch (Exception ex){
            throw new ProviderException(ex.getMessage(), ErrorMsj.XML_FIRMA.getMsj(), ErrorMsj.XML_FIRMA.getCod());
        }
    }

    public static String guardaArchivo(byte[] datos,String carpetaPrincipal, String fileName){
        String monthDirName = LocalDate.now().format(carpeta);
        String jarDir = new File(Util.class.getProtectionDomain().getCodeSource().getLocation().getPath()).getParent();
        String cdrDirPath = jarDir + File.separator + carpetaPrincipal + File.separator +monthDirName;
        File directory = new File(cdrDirPath);
        if (!directory.exists()) {
            boolean wasDirectoryMade = directory.mkdirs();
            if (!wasDirectoryMade) {
                throw new ProviderException(ErrorMsj.PATH_COMPROBANTE.getMsj(),ErrorMsj.PATH_COMPROBANTE.getCod());
            }
        }
        String rutaCompleta = cdrDirPath+ File.separator + fileName;
        try {
            Files.write(Paths.get(rutaCompleta), datos, StandardOpenOption.CREATE);
            return rutaCompleta;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String toCamelCase(String input){
        if (input == null || input.isEmpty()) {
            return input;
        }
        String[] words = input.split("[\\s\\W]+");
        StringBuilder camelCaseString = new StringBuilder(words[0].toLowerCase());
        for (int i = 1; i < words.length; i++) {
            camelCaseString.append(words[i].substring(0, 1).toUpperCase())
                    .append(words[i].substring(1).toLowerCase());
        }
        return camelCaseString.toString();
    }

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

    public static String aFormato(LocalDateTime data, DateTimeFormatter formateador) {
        return data.format(formateador);
    }

    public static String aHoraMinuto(LocalTime data) {
        DateTimeFormatter formateador = DateTimeFormatter.ofPattern("HH:mm");
        return data.format(formateador);
    }

    public static String aHoraMinutoSegundo(LocalTime data) {
        DateTimeFormatter formateador = DateTimeFormatter.ofPattern("HH:mm:ss");
        return data.format(formateador);
    }
    public static String dateAYYYY_MM_DD(LocalDate data){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return data.format(formatter);
    }
    public static String dateADD_MM_YYYY(LocalDate data){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return data.format(formatter);
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
        String monthDirName = LocalDate.now().format(carpeta);
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

    public static ComprobanteResponse recuperaArchivoSunat(String ruta, String prefijo, Integer tipo){
        try{
            File file = new File(ruta);
            byte[] fileContent = Files.readAllBytes(file.toPath());
            return new ComprobanteResponse(
                    Base64.getEncoder().encodeToString(fileContent),
                    prefijo,
                    String.valueOf(tipo),
                    file.getName()
            );
        }catch (Exception e){
            throw new ProviderException(ErrorMsj.NO_EXISTE_ARCHIVO.getMsj(),ErrorMsj.NO_EXISTE_ARCHIVO.getCod());
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
        if(partes.length !=2){
            throw new ProviderException(ErrorMsj.FORMATO_IMG.getMsj(),ErrorMsj.FORMATO_IMG.getCod());
        }
        String imageString = partes[1];
        String extension = switch (partes[0]) {
            case "data:image/jpeg;base64" -> "jpeg";
            case "data:image/png;base64" -> "png";
            default -> throw new ProviderException(ErrorMsj.FORMATO_IMG.getMsj(),ErrorMsj.FORMATO_IMG.getCod());
        };
        byte[] imagenBytes = Base64.getDecoder().decode(imageString);

        try (InputStream is = new ByteArrayInputStream(imagenBytes)) {
            BufferedImage bufferedImage = ImageIO.read(is);
            File archivo = new File(path + nombre + "." + extension);
            ImageIO.write(bufferedImage, extension, archivo);
            return archivo.getAbsolutePath();
        } catch (Exception e) {
            throw new ProviderException(ErrorMsj.GUARDAR_COMPROBANTE.getMsj(),ErrorMsj.GUARDAR_COMPROBANTE.getCod());
        }
    }

/*    public static X509Certificate getCertificate(){
        ClassPathResource resource = new ClassPathResource(CERT_SUNAT);
        try (InputStream inputStream = resource.getInputStream()) {
            String pemContent = readPemContent(inputStream);
            String[] parts = pemContent.split("-----END CERTIFICATE-----", 2);
            return loadCertificate(parts[0] + "-----END CERTIFICATE-----");
        }catch (Exception ex){
            //throw new ProviderException(ex.getMessage(), )
        }
    }

    private static String readPemContent(InputStream inputStream) throws Exception {
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }

    private static X509Certificate loadCertificate(String certificateString) throws Exception {
        String certContents = certificateString.trim().replace("-----BEGIN CERTIFICATE-----", "").replace("-----END CERTIFICATE-----", "");
        byte[] decoded = Base64.getDecoder().decode(certContents);

        CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
        X509Certificate certificate = (X509Certificate) certFactory.generateCertificate(new ByteArrayInputStream(decoded));
        return certificate;
    }

    private static PrivateKey loadPrivateKey(String keyString) throws Exception {
        String privKeyPEM = keyString.trim().replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "");
        byte[] decoded = Base64.getDecoder().decode(privKeyPEM);

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
        return privateKey;
    }

    public static void main(String[] args) throws Exception {
        String filename = "path/inside/jar/to/pemfile.pem"; // Actualiza esta ruta al archivo PEM dentro del JAR
        ClassPathResource resource = new ClassPathResource(filename);
        try (InputStream inputStream = resource.getInputStream()) {
            String pemContent = readPemContent(inputStream);

            String[] parts = pemContent.split("-----END CERTIFICATE-----", 2);

            X509Certificate certificate = loadCertificate(parts[0] + "-----END CERTIFICATE-----");
            PrivateKey privateKey = loadPrivateKey(parts[1]);

            System.out.println("Certificate:");
            System.out.println(certificate);
            System.out.println("Private Key:");
            System.out.println(privateKey);
        }
    }*/


}
