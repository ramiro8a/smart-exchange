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

    private String getRequestIdInternal() {
        return (String) requestHttp.getAttribute(ConstValues.REQUEST_ID_INTERNAL);
    }
}
