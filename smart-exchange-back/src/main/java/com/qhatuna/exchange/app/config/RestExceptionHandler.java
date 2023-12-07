package com.qhatuna.exchange.app.config;
import com.qhatuna.exchange.commons.api.ApiError;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.log.LogPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler {
    @Autowired
    private LogPrinter logPrinter;

    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return buildResponseEntity(new ApiError(ErrorMsj.JSON.getMsj(), ErrorMsj.JSON.getMsjTec(), ErrorMsj.JSON.getCod(), HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        return buildResponseEntity(new ApiError(ErrorMsj.REQUEST.getMsj(), ErrorMsj.REQUEST.getMsjTec(), ErrorMsj.REQUEST.getCod(), HttpStatus.BAD_REQUEST));
    }
    @ExceptionHandler(MissingRequestHeaderException.class)
    protected ResponseEntity<Object> handleMissingRequestHeaderException(MissingRequestHeaderException ex) {
        return buildResponseEntity(new ApiError(ErrorMsj.REQUEST.getMsj(), ex.getMessage(), ErrorMsj.REQUEST.getCod(), HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(ProviderException.class)
    protected ResponseEntity<Object> handleMethodProviderException(ProviderException ex) {
        logPrinter.write(ex);
        return buildResponseEntity(new ApiError(ex.getMensaje(),ex.getMensajeTec(), ex.getCodigo(), ex.getStatus()));
    }

    @ExceptionHandler(DataAccessException.class)
    protected ResponseEntity<Object> handleMethodBadException(DataAccessException ex) {
        logPrinter.write(ex);
        return buildResponseEntity(new ApiError(ErrorMsj.DB_ERROR.getMsj(), ex.getMessage(), ErrorMsj.DB_ERROR.getCod(), HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleMethodBadException(Exception ex) {
        logPrinter.write(ex);
        return buildResponseEntity(new ApiError(ErrorMsj.GENERIC.getMsj(), ex.getMessage(), ErrorMsj.GENERIC.getCod(), HttpStatus.INTERNAL_SERVER_ERROR));
    }

    private ResponseEntity<Object> buildResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
}
