package com.qhatuna.exchange.app.rest.response;

public record AutenticationResponse (
        String tipo,
        String token,
        String refreshToken
){}
