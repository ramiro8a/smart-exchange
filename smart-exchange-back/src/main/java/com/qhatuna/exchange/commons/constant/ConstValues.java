package com.qhatuna.exchange.commons.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ConstValues {
    public static final String ASUNTO_VERIFICA = "Confirmación de correo LC-EXCHANGE";
    public static final String ASUNTO_PASSWORD = "Cambio de contraseña LC-EXCHANGE";
    public static final String ASUNTO_COMPROBANTE = "Comprobante operacion LC-EXCHANGE";
    public static final String CUERPO_VERIFICA = """
                Estimad@ cliente.<br>Para confirmar su cuenta en LC-EXCHANGE haga clic
                <a href='%s' target="_blank"
                style="background-color: #007bff; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-family: Arial, sans-serif;"
                >%s</a><br>
                Su usuario para ingresar a nuestra plataforma es su correo y la contraseña con la que se registró.
            """;
    public static final String CUERPO_PASSWORD = """
                Estimad@ cliente.<br>Para cambiar la contraseña de su cuenta en LC-EXCHANGE haga clic
                <a href='%s' target="_blank"
                style="background-color: #007bff; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-family: Arial, sans-serif;"
                >%s</a>
            """;
    public static final String CUERPO_COMPROBANTE = """
                Estimad@ cliente.<br> Adjunto le enviamos su comprobante de la operación %s
            """;
    public static final Integer SOLES_ISO = 604;
    public static final Integer USD_ISO = 840;
    public static final Integer EURO_ISO = 978;
    public static final Integer TC_LC_EXCHANGE = 1;
    public static final Integer TC_SUNAT = 2;
    public static final Integer TC_BANCOS = 3;
    public static final Integer TD_RUC = 2;
    public static final Integer AHORRO_DIA = 1;
    public static final Integer FACTURA_ZIP = 1;
    public static final Integer CDR_XML = 2;
    public static final Integer COMPROBANTE_PDF = 3;
    public static final String SUNAT_LOGO = "data:image/png;base64,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";

}
