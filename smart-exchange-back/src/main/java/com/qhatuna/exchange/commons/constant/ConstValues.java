package com.qhatuna.exchange.commons.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ConstValues {
    public static final String ASUNTO_VERIFICA = "Confirmación de correo LC-EXCHANGE";
    public static final String ASUNTO_PASSWORD = "Cambio de contraseña LC-EXCHANGE";
    public static final String CUERPO_VERIFICA = """
                Estimad@ cliente.<br>Para confirmar su cuenta en LC-EXCHANGE haga clic
                <a href='%s' target="_blank"
                style="background-color: #007bff; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-family: Arial, sans-serif;"
                >%s</a>
            """;
    public static final String CUERPO_PASSWORD = """
                Estimad@ cliente.<br>Para cambiar la contraseña de su cuenta en LC-EXCHANGE haga clic
                <a href='%s' target="_blank"
                style="background-color: #007bff; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-family: Arial, sans-serif;"
                >%s</a>
            """;
    public static final Integer SOLES_ISO = 604;
    public static final Integer USD_ISO = 840;
    public static final Integer EURO_ISO = 978;
    public static final Integer TC_LC_EXCHANGE = 1;
    public static final Integer TC_SUNAT = 2;
    public static final Integer TC_BANCOS = 3;
    public static final Integer TD_RUC = 2;
}
