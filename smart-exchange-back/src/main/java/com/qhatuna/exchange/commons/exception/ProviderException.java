package com.qhatuna.exchange.commons.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ProviderException  extends RuntimeException {
    private String codigo;
    private String mensaje;
    private String mensajeTec;
    private HttpStatus status;

    public ProviderException(String mensaje, String codigo){
        super(mensaje);
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.mensajeTec = recuperaMensajeTec();
        this.status = HttpStatus.NOT_ACCEPTABLE;
    }

    public ProviderException(String mensaje, String codigo, HttpStatus status){
        super(mensaje);
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.mensajeTec = recuperaMensajeTec();
        this.status = status;
    }

    public ProviderException(String mensajeTec, String mensaje, String codigo){
        super(mensajeTec);
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.mensajeTec = mensajeTec;
        this.status = HttpStatus.NOT_ACCEPTABLE;
    }

    public ProviderException(String mensajeTec, String mensaje, String codigo, HttpStatus status){
        super(mensajeTec);
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.mensajeTec = mensajeTec;
        this.status = status;
    }

    private String recuperaMensajeTec() {
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        if (stackTrace.length > 3) {
            StackTraceElement elemento = stackTrace[3];
            String clase = elemento.getFileName();
            String methodName = elemento.getMethodName()+":"+elemento.getLineNumber();
            return clase + ":" + methodName;
        }else {
            return null;
        }
    }
}
