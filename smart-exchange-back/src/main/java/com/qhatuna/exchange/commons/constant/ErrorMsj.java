package com.qhatuna.exchange.commons.constant;

import lombok.Getter;

@Getter
public enum ErrorMsj {
    JSON("CR-0001", "Error de datos", "El json no se ha podido deserializar"),
    PROCESSING_LOG("MDWRLIB-0004", "Error when preprocessing log"),
    REQUEST("CR-0002", "Error en los datos recibidos"),
    NO_EXISTE_EMPRESA("CRE-0003", "La empresa no existe"),
    YA_EXISTE_EMPRESA("CRE-0004", "La empresa ya existe"),
    NO_EXISTE_SUCURSAL("CRS-0003", "La sucursal no existe"),
    GENERIC("CR-9999", "Error interno del servidor");
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
