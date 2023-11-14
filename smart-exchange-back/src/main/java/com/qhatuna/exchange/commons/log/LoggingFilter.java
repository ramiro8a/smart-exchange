package com.qhatuna.exchange.commons.log;

import com.qhatuna.exchange.commons.log.dto.ApiRequestLog;
import com.qhatuna.exchange.commons.utils.Util;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class LoggingFilter implements Filter {
    private final String[] urls = new String[]{"health", "swagger", "favicon", "api-docs", "actuator"};

    private final LogPrinter<ApiRequestLog> logPrinter;

    public LoggingFilter(LogPrinter<ApiRequestLog> logPrinter){
        this.logPrinter = logPrinter;
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        ApiRequestLog logInfo = new ApiRequestLog();
        try {
            HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
            HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;

            String uuid = UUID.randomUUID().toString();
            httpServletRequest.setAttribute(ConstValues.REQUEST_ID_INTERNAL, uuid);
            logInfo.setRequestIdInternal(uuid);
            logInfo.setInDate(LocalDateTime.now());
            logInfo.setRemoteAddress(httpServletRequest.getRemoteAddr());
            logInfo.setPath(httpServletRequest.getRequestURI());
            logInfo.setMethod(httpServletRequest.getMethod());
            logInfo.setHeaders(buildHeaders(httpServletRequest));
            logInfo.setQueryParameters(buildParameters(httpServletRequest));

            //BufferedRequestWrapper bufferedRequest = new BufferedRequestWrapper(httpServletRequest);
            ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(httpServletRequest);
            byte[] requestBody = requestWrapper.getContentAsByteArray();
            ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper((HttpServletResponse) servletResponse);

            //BufferedResponseWrapper bufferedResponse = new BufferedResponseWrapper(httpServletResponse);
            filterChain.doFilter(servletRequest, servletResponse);
            logInfo.setOutDate(LocalDateTime.now());
            logInfo.setStatus(httpServletResponse.getStatus());
            byte[] responseBody = responseWrapper.getContentAsByteArray();
            logPrinter.write(logInfo);
        }catch (Exception ex) {
            //throw new HandledException("ERROR: Filtro de logs : " + ex.getMessage());
        }
    }

    private String buildParameters(HttpServletRequest httpServletRequest){
        Map<String, String> paramsValue = new HashMap<>();
        Enumeration<String> queryParametersNames = httpServletRequest.getParameterNames();
        while (httpServletRequest.getParameterNames().hasMoreElements()) {
            String key = queryParametersNames.nextElement();
            paramsValue.put(key, httpServletRequest.getParameter(key));
        }
        return Util.objectToString(paramsValue, false);
    }

    public static String buildHeaders(HttpServletRequest httpServletRequest){
        Map<String, String> paramsValue = new HashMap<>();
        Enumeration<String> headerNames = httpServletRequest.getHeaderNames();
        StringBuilder headers = new StringBuilder();
        while (headerNames.hasMoreElements()) {
            String key = headerNames.nextElement();
            paramsValue.put(key, httpServletRequest.getHeader(key));
        }
        return headers.toString();
    }

}
