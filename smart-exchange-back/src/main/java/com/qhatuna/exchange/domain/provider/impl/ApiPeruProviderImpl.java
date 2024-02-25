package com.qhatuna.exchange.domain.provider.impl;

import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import com.qhatuna.exchange.domain.provider.ApiPeruProvider;
import com.qhatuna.exchange.domain.provider.dto.EmpresaResponse;
import com.qhatuna.exchange.domain.provider.dto.PersonaResponse;
import com.qhatuna.exchange.domain.provider.dto.TipoCambioRequest;
import com.qhatuna.exchange.domain.provider.dto.TipoCambioResponseDTO;
import okhttp3.*;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class ApiPeruProviderImpl implements ApiPeruProvider {
    private final Environment env;
    private final OkHttpClient client = new OkHttpClient();
    private static final String URL = "provider.apiperu.url";
    private static final String ACCEPT = "Accept";
    private static final String APP_JSON = "application/json";
    private static final String AUTHORIZATION = "Authorization";
    private static final String BEARER = "Bearer ";
    private static final String TOKEN = "provider.apiperu.token";

    public ApiPeruProviderImpl(Environment env) {
        this.env = env;
    }

    @Override
    public PersonaResponse recuperaPorDNI(String dni) throws ProviderException {
        Request request = new Request.Builder()
                .url(env.getProperty(URL)+
                        env.getProperty("provider.apiperu.dni.path")+
                        "/"+dni)
                .header(ACCEPT, APP_JSON)
                .header(AUTHORIZATION, BEARER+env.getProperty(TOKEN))
                .build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new ProviderException(ErrorMsj.API_PERU_ERROR.getMsj(), ErrorMsj.API_PERU_ERROR.getCod());
            PersonaResponse persona = Util.stringToObject(response.body().string(), PersonaResponse.class);
            if (!persona.success())
                throw new ProviderException(ErrorMsj.API_PERU_DATA_ERROR.getMsj(), ErrorMsj.API_PERU_DATA_ERROR.getCod());
            return persona;
        } catch (IOException e) {
            throw new ProviderException(ErrorMsj.API_PERU_ERROR.getMsj(), ErrorMsj.API_PERU_ERROR.getCod());
        }
    }


    @Override
    public EmpresaResponse recuperaPorRUC(String ruc) throws ProviderException {
        Request request = new Request.Builder()
                .url(env.getProperty(URL)+
                        env.getProperty("provider.apiperu.ruc.path")+
                        "/"+ruc)
                .header(ACCEPT, APP_JSON)
                .header(AUTHORIZATION, BEARER+env.getProperty(TOKEN))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new ProviderException(ErrorMsj.API_PERU_ERROR.getMsj(), ErrorMsj.API_PERU_ERROR.getCod());
            EmpresaResponse empresa = Util.stringToObject(response.body().string(), EmpresaResponse.class);
            if (!empresa.success())
                throw new ProviderException(ErrorMsj.API_PERU_DATA_ERROR.getMsj(), ErrorMsj.API_PERU_DATA_ERROR.getCod());
            return empresa;
        } catch (IOException e) {
            throw new ProviderException(ErrorMsj.API_PERU_ERROR.getMsj(), ErrorMsj.API_PERU_ERROR.getCod());
        }
    }

    @Override
    public TipoCambioResponseDTO recuperaTipoCambio() throws ProviderException {
        MediaType mediaType = MediaType.parse(APP_JSON);
        TipoCambioRequest requestData = new TipoCambioRequest(Util.dateTimeToStringYYYY_MM_DD(LocalDateTime.now()));
        RequestBody body = RequestBody.create(Util.objectToString(requestData, false), mediaType);
        Request request = new Request.Builder()
                .url(env.getProperty(URL)+
                        env.getProperty("provider.apiperu.tipo-cambio.path"))
                .post(body)
                .header(ACCEPT, APP_JSON)
                .header(AUTHORIZATION, BEARER+env.getProperty(TOKEN))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new ProviderException(ErrorMsj.API_PERU_ERROR.getMsj(), ErrorMsj.API_PERU_ERROR.getCod());
            TipoCambioResponseDTO tc = Util.stringToObject(response.body().string(), TipoCambioResponseDTO.class);
            if (!tc.success())
                throw new ProviderException(ErrorMsj.API_PERU_DATA_ERROR.getMsj(), ErrorMsj.API_PERU_DATA_ERROR.getCod());
            return tc;
        } catch (IOException e) {
            throw new ProviderException(ErrorMsj.API_PERU_ERROR.getMsj(), ErrorMsj.API_PERU_ERROR.getCod());
        }
    }
}
