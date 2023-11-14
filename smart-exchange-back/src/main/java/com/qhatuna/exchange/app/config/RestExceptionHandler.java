package com.qhatuna.exchange.app.config;
import com.qhatuna.exchange.commons.api.ApiError;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return buildResponseEntity(new ApiError(ErrorMsj.JSON.getMsj(), ErrorMsj.JSON.getMsjTec(), ErrorMsj.JSON.getCod(), HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        return buildResponseEntity(new ApiError(ErrorMsj.REQUEST.getMsj(), ErrorMsj.REQUEST.getMsjTec(), ErrorMsj.REQUEST.getCod(), HttpStatus.BAD_REQUEST));
    }
    @ExceptionHandler(ProviderException.class)
    protected ResponseEntity<Object> handleMethodProviderException(ProviderException ex) {
        return buildResponseEntity(new ApiError(ex.getMensaje(),ex.getMensajeTec(), ex.getCodigo(), ex.getStatus()));
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleMethodBadException(Exception ex) {
        return buildResponseEntity(new ApiError(ErrorMsj.GENERIC.getMsj(), ex.getMessage(), ErrorMsj.GENERIC.getCod(), HttpStatus.INTERNAL_SERVER_ERROR));
    }

    private ResponseEntity<Object> buildResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
}
