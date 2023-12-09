package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.CuentaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuentaBancariaRepository extends JpaRepository<CuentaBancaria, Long> {
    @Query("select cb from CuentaBancaria cb where cb.usuarioId=?1 and cb.estado not in (1)")
    List<CuentaBancaria> recuperaActivosPorUsuarioId(Long id);
}
