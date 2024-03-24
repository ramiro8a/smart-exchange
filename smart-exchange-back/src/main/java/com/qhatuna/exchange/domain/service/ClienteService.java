package com.qhatuna.exchange.domain.service;

import com.qhatuna.exchange.app.rest.request.ClienteRequest;
import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import com.qhatuna.exchange.commons.constant.Const;
import com.qhatuna.exchange.commons.constant.ConstValues;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.domain.model.Cliente;
import com.qhatuna.exchange.domain.model.Usuario;
import com.qhatuna.exchange.domain.provider.apiperu.ApiPeruProvider;
import com.qhatuna.exchange.domain.provider.apiperu.dto.EmpresaResponse;
import com.qhatuna.exchange.domain.provider.apiperu.dto.PersonaResponse;
import com.qhatuna.exchange.domain.repository.ClienteRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ClienteService {
    private final ClienteRepository repository;
    private final SessionInfoService sessionInfoService;
    private final NotificacionService notificacionService;
    private final ApiPeruProvider apiPeruProvider;

    public ClienteResponse recuperaClientePorSesion(){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Cliente cliente = recuperaClientePorUsuarioId(usuario.getId());
        return Cliente.aResponse(cliente);
    }
    public ClienteResponse crea(ClienteRequest request){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Optional<Cliente> optCliente = repository.findByUsuarioId(usuario.getId());
        if(optCliente.isPresent() && optCliente.get().isValidado()){
            if(request.celular().isBlank()){
                throw new ProviderException(ErrorMsj.CLIENTE_YA_EXISTE.getMsj(),
                        ErrorMsj.CLIENTE_YA_EXISTE.getCod(),HttpStatus.BAD_REQUEST);
            }else{
                Cliente clActualizado = optCliente.get();
                clActualizado.setCelular(request.celular());
                return Cliente.aResponse(repository.save(clActualizado));
            }
        }
        Cliente cliente = new Cliente();
        if(optCliente.isPresent() && !optCliente.get().isValidado()){
            cliente = optCliente.get();
            cliente.setTipoDocumento(request.tipoDocumento());
            cliente.setNroDocumento(request.nroDocumento());
            cliente.setCelular(request.celular());
            cliente.setTelefono(request.telefono());
            cliente.setNombres(request.nombres());
            cliente.setPaterno(request.paterno());
            cliente.setMaterno(request.materno());
        }
        if(optCliente.isEmpty()){
            List<Cliente> clientes = repository.recuperaPorNroDocumento(request.nroDocumento().trim());
            if(!clientes.isEmpty()){
                throw new ProviderException(ErrorMsj.CLIENTE_YA_EXISTE.getMsj(),
                        ErrorMsj.CLIENTE_YA_EXISTE.getCod(),HttpStatus.BAD_REQUEST);
            }
            cliente = Cliente.builder()
                    .tipoDocumento(request.tipoDocumento())
                    .nroDocumento(request.nroDocumento().trim())
                    .celular(request.celular())
                    .telefono(request.telefono())
                    .nombres(request.nombres())
                    .paterno(request.paterno())
                    .materno(request.materno())
                    .usuarioId(usuario.getId())
                    .build();
        }
        if(request.tipoDocumento().equals(ConstValues.TD_RUC)) {
            validaEmpresa(cliente, request.nroDocumento());
        } else {
            validaPersona(cliente, request.nroDocumento());
        }
        cliente = repository.save(cliente);
        if(!cliente.isValidado()){
            notificacionService.notifValidarCLiente(cliente);
            throw new ProviderException(ErrorMsj.CLIENTE_REG_NO_VALIDADO.getMsj(),
                    ErrorMsj.CLIENTE_REG_NO_VALIDADO.getCod(),HttpStatus.BAD_REQUEST);
        }
        return Cliente.aResponse(cliente);
    }

    public List<ClienteResponse> lista(Integer page, Integer size, Integer tipo, String valor){
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        List<Cliente> clientes;
        if(tipo.equals(1)){
            clientes = repository.recuperaTodo(pageable);
        } else if (tipo.equals(2)) {
            clientes = repository.recuperaPorApellido(valor, pageable);
        } else if (tipo.equals(3)) {
            clientes = repository.recuperaPorNroDocumento(valor, pageable);
        }else {
            throw new ProviderException(ErrorMsj.TIPO_BUSQUEDA_NO_EXISTE.getMsj(),
                    ErrorMsj.TIPO_BUSQUEDA_NO_EXISTE.getCod(),HttpStatus.BAD_REQUEST);
        }
        return clientes.stream().map(Cliente::aResponse).toList();
    }

    public void valida(Long id){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Cliente cliente = recuperaClientePorId(id);
        cliente.setValidado(!cliente.isValidado());
        cliente.setUsuarioActualizacion(usuario.getId());
        repository.save(cliente);
    }

    public void cambiaEstadoHabilitadoDeshabilitado(Long id){
        Usuario usuario = sessionInfoService.getSession().getUsusario();
        Cliente cliente = recuperaClientePorId(id);
        cliente.setEstado(cliente.getEstado().equals(Const.EstadoRegistro.ACTIVO)?Const.EstadoRegistro.DESHABILITADO:Const.EstadoRegistro.ACTIVO);
        cliente.setUsuarioActualizacion(usuario.getId());
        repository.save(cliente);
    }

    public Cliente recuperaClientePorId(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CLIENTE_NOEXISTE.getMsj(),
                        ErrorMsj.CLIENTE_NOEXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }

    public Cliente recuperaClientePorUsuarioId(Long id){
        return repository.findByUsuarioId(id)
                .orElseThrow(() -> new ProviderException(
                        ErrorMsj.CLIENTE_NOEXISTE.getMsj(),
                        ErrorMsj.CLIENTE_NOEXISTE.getCod(),
                        HttpStatus.BAD_REQUEST
                ));
    }

    private void validaPersona(Cliente cliente, String dni){
        try {
            PersonaResponse persona = apiPeruProvider.recuperaPorDNI(dni);
            if(persona!=null && persona.data()!=null){
                cliente.setNombres(persona.data().nombres());
                cliente.setNombreCompleto(persona.data().nombreCompleto());
                cliente.setPaterno(persona.data().paterno());
                cliente.setMaterno(persona.data().materno());
                cliente.setValidado(true);
            }
        }catch (Exception ex){
            //
        }
    }

    private void validaEmpresa(Cliente cliente, String ruc){
        try {
            EmpresaResponse empresa = apiPeruProvider.recuperaPorRUC(ruc);
            if(empresa!=null && empresa.data()!=null && empresa.data().estado().equalsIgnoreCase("ACTIVO")){
                cliente.setNombres(empresa.data().razonSocial());
                cliente.setNombreCompleto(empresa.data().razonSocial());
                cliente.setValidado(true);
            }
        }catch (Exception ex){
            //
        }
    }
}
