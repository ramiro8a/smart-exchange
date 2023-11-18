package com.qhatuna.exchange.commons.constant;

import lombok.Getter;

@Getter
public enum ErrorMsj {
    JSON("ERR-0001", "Error de datos", "El json no se ha podido deserializar"),
    PROCESSING_LOG("ERR-0002", "Error when preprocessing log"),
    REQUEST("ERR-0003", "Error en los datos recibidos"),
    BASIC_AUTH("ERR-0004", "No existe credenciales"),
    UNAUTHORIZED("ERR-0005", "Acceso no authorizado"),
    NO_HAY_ROL("ERR-0006", "El rol a utilizar no existe"),
    ENVIO_EMAIL("ERR-0007", "Error al enviar email, favor intente más tarde"),
    USUARIO_VACIO("ERR-0008", "Usuario no encontrado"),
    CONFIRM_ERROR("ERR-0009", "Error al confirmar correo"),
    CORREO_EXISTE("ADV-0010", "El correo ya existe"),
    USUARIO_EXISTE("ERR-0011", "El usuario ya existe"),
    CORREO_NO_VALIDO("ADV-0012", "Su correo no fue confirmado"),
    GENERIC("ERR-9999", "Error interno del servidor");
    final String cod;
    final String msj;
    final String msjTec;

    ErrorMsj(String cod, String msj) {
        this.cod = cod;
        this.msj = msj;
        this.msjTec = msj;
    }
    ErrorMsj(String cod, String msj, String msjTec) {
        this.cod = cod;
        this.msj = msj;
        this.msjTec = msjTec;
    }
}
