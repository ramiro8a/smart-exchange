package com.qhatuna.exchange.commons.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
            throw new ProviderException(getExceptionMsg(e),ErrorMsj.PROCESSING_LOG.getMsj(), ErrorMsj.PROCESSING_LOG.getCod());
        }
    }

    public static String getExceptionMsg(Exception ex){
        return ex.getCause()==null?ex.getMessage():ex.getCause().getMessage();
    }

    public static String dateTimeToString(LocalDateTime data){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return data.format(formatter);
    }

    public static String generadorTicket() {
        LocalDateTime now = LocalDateTime.now();
        String timestamp = now.format(formatter);
        long count = counter.incrementAndGet();
        return timestamp + String.format("%04d", count);
    }

    private static ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}
