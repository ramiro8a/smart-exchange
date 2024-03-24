package com.qhatuna.exchange.commons.log;

import com.qhatuna.exchange.commons.log.dto.ApiRequestLog;
import com.qhatuna.exchange.commons.utils.Util;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class LogPrinter<T> {
    @Autowired
    protected HttpServletRequest requestHttp;

    public void write(ApiRequestLog apiRequestLog) {
        apiRequestLog.setRequestIdInternal(getRequestIdInternal());
        apiRequestLog.setOutDate(LocalDateTime.now());
        log.info(Util.objectToString(apiRequestLog, true));
    }

    public void write(String data){
        log.info(data);
    }

    public void write(Exception ex) {
        ApiRequestLog apiLog = ApiRequestLog.builder()
                .requestIdInternal(getRequestIdInternal())
                .outDate(LocalDateTime.now())
                .errorType(ex.getClass().getName())
                .errorMessage(Util.getExceptionMsg(ex))
                .build();
        StackTraceElement[] stackTraceElements = ex.getStackTrace();
        if (stackTraceElements.length > 0) {
            StackTraceElement elemento = stackTraceElements[0];
            apiLog.setErrorClass(elemento.getClassName());
            apiLog.setMethod(elemento.getMethodName());
            apiLog.setLine(String.valueOf(elemento.getLineNumber()));
        }
        log.error(Util.objectToString(apiLog, true));
    }

    private String getRequestIdInternal() {
        return (String) requestHttp.getAttribute(ConstValues.REQUEST_ID_INTERNAL);
    }
}
