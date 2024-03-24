package com.qhatuna.exchange.domain.model;

import com.qhatuna.exchange.app.rest.response.ClienteResponse;
import com.qhatuna.exchange.commons.constant.ErrorMsj;
import com.qhatuna.exchange.commons.exception.ProviderException;
import com.qhatuna.exchange.commons.utils.Util;
import io.github.project.openubl.xbuilder.content.catalogs.Catalog6;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="t_cliente")
public class Cliente  extends BaseModel{
    private String nombres;
    @Column(name = "nombre_completo")
    private String nombreCompleto;
    @Column(name = "ap_paterno")
    private String paterno;
    @Column(name = "ap_materno")
    private String materno;
    @Column(name = "tipo_doc")
    private Integer tipoDocumento;
    @Column(name = "nro_doc")
    private String nroDocumento;
    private String telefono;
    private String celular;
    @Column(name = "dni_anverso")
    private String dniAnverso;
    @Column(name = "dni_reverso")
    private String dniReverso;
    private boolean validado;
    @Column(name = "usuario_id")
    private Long usuarioId;
/*    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;*/

    public static io.github.project.openubl.xbuilder.content.models.common.Cliente aClienteSunat(Cliente cliente){
        return io.github.project.openubl.xbuilder.content.models.common.Cliente.builder()
                .nombre(cliente.nombreCompleto)
                .numeroDocumentoIdentidad(cliente.nroDocumento)
                .tipoDocumentoIdentidad(Util.recuperaTipoDoocumentoSunat(cliente.getTipoDocumento()))
                .build();
    }

    public static ClienteResponse aResponse(Cliente cliente){
        return new ClienteResponse(
                cliente.getId(),
                cliente.getFechaCreacion(),
                cliente.getNombres(),
                cliente.getPaterno(),
                cliente.getMaterno(),
                cliente.getTipoDocumento(),
                cliente.getNroDocumento(),
                cliente.getTelefono(),
                cliente.getCelular(),
                cliente.getEstado(),
                cliente.isValidado(),
                cliente.getUsuarioId()
        );
    }

    public boolean esFactura(){
        String tipoComprobante= Util.recuperaTipoComprobante(
                Util.recuperaTipoDoocumentoSunat(this.getTipoDocumento())
        );
        return tipoComprobante.equals("01");
    }

    public String getTipoDocDesc(){
        return switch (this.getTipoDocumento()) {
            case 1 -> "DNI";
            case 2 -> "RUC";
            case 3 -> "CE";
            case 4 -> "PSP";
            default -> "DESCONOCIDO";
        };
    }
}
