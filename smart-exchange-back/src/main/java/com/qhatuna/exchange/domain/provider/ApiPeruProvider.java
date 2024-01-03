package com.qhatuna.exchange.domain.provider;

import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.provider.dto.EmpresaResponse;
import com.qhatuna.exchange.domain.provider.dto.PersonaResponse;
import com.qhatuna.exchange.domain.provider.dto.TipoCambioResponseDTO;

public interface ApiPeruProvider {
    PersonaResponse recuperaPorDNI(String dni) throws ProviderException;
    EmpresaResponse recuperaPorRUC(String ruc) throws ProviderException;
    TipoCambioResponseDTO recuperaTipoCambio() throws ProviderException;
}
