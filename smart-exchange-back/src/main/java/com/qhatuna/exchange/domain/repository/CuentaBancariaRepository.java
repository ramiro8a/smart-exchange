package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.CuentaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuentaBancariaRepository extends JpaRepository<CuentaBancaria, Long> {
    @Query("select cb from CuentaBancaria cb where cb.usuarioId=?1 and cb.estado not in (1) order by cb.id desc")
    List<CuentaBancaria> recuperaActivosPorUsuarioId(Long id);
    @Query("select cb from CuentaBancaria cb where cb.usuarioId=0 and cb.estado not in (1)")
    List<CuentaBancaria> recuperaActivosEmpresa();

    @Query("select cb from CuentaBancaria cb where cb.usuarioId=0 and cb.estado=0 and cb.banco.id=?1 and cb.moneda=?2")
    List<CuentaBancaria> recuperaCuentaTransferencia(Long bancoId, Integer moneda);
    @Query("select cb from CuentaBancaria cb where cb.usuarioId=0 and cb.estado=0 and cb.moneda=?1")
    List<CuentaBancaria> recuperaCuentaTransferenciaDefault(Integer moneda);
}
