package com.qhatuna.exchange.app.rest.response;

public record ComprobanteVentaResponse(
    Long id,
    Integer nroFactura,
    String facturaTicketSunat,
    String facturaHash,
    Integer nroComprobante,
    String estado,
    Integer codigoRespuesta,
    String descripcion,
    String nroCompleto,
    boolean envioSunat
) {}
