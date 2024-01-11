package com.qhatuna.exchange.commons.constant;

import lombok.Getter;

@Getter
public enum ErrorMsj {
    JSON("ERR-0001", "Error de datos", "El json no se ha podido deserializar"),
    PROCESSING_LOG("ERR-0002", "Error when preprocessing log"),
    REQUEST("ERR-0003", "Error en los datos datos enviado por el cliente"),
    BASIC_AUTH("ERR-0004", "No existe credenciales"),
    UNAUTHORIZED("ERR-0005", "Acceso no authorizado"),
    NO_HAY_ROL("ERR-0006", "El rol a utilizar no existe"),
    ENVIO_EMAIL("ERR-0007", "Error al enviar email, favor intente más tarde"),
    USUARIO_VACIO("ERR-0008", "Usuario no encontrado"),
    CONFIRM_ERROR("ERR-0009", "Error al confirmar correo"),
    USUARIO_EXISTE("ERR-0010", "El usuario ya existe"),
    DB_ERROR("ERR-0011", "Error en el proveedor de datos"),
    PROCESSING_OBJECT("ERR-0012", "Error al mapear objetos"),
    GENERIC("ERR-9999", "Error interno del servidor"),
    CORREO_EXISTE("ADV-0001", "El correo ya existe"),
    CORREO_NO_VALIDO("ADV-0002", "Su correo no fue confirmado"),
    TIPO_CAMBIO("ADV-0003", "El tipo de cambio no está configurado"),
    BANCO_NO_EXISTE("ADV-0004", "El banco no existe"),
    MONEDA_NO_CONFIGURADA("ADV-0005", "Actualmente LC Exchange no trabaja con la moneda origen"),
    CUENTA_NO_EXISTE("ADV-0006", "Cuenta origen no existe"),
    CLIENTE_NOEXISTE("ADV-0009", "El cliente no existe"),
    TIPO_BUSQUEDA_NO_EXISTE("ADV-0010", "El tipo de búsqueda no existe"),
    OPCION_NO_EXISTE("ADV-0011", "La opción no existe"),
    OPERACION_NOEXISTE("ADV-0012", "La operacion no existe"),
    INICIO_ANTES_FIN("ADV-0013", "La fecha inicio debe ser antes que la fecha fin"),
    CONVERSION_NO_PERMITIDO("ADV-0014", "Conversión no permitida"),
    GUARDAR_COMPROBANTE("ADV-0015", "Error al guardar el comprobante"),
    PATH_COMPROBANTE("ADV-0016", "Error al crear la carpeta para guardar el comprobante"),
    API_PERU_ERROR("ADV-0017", "Error en el servicio de verificacion"),
    API_PERU_DATA_ERROR("ADV-0018", "No existe datos con los criterios de búsqueda enviados"),
    NOHAY_COMPROBANTE("ADV-0019", "No hemos podido encontrar el archivo"),
    CLIENTE_NO_VALIDADO("ADV-0020", "Sus datos personales aún no han sido validados");
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
