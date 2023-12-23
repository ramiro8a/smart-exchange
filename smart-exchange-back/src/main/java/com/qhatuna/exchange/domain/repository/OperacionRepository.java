package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Operacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface OperacionRepository extends JpaRepository<Operacion, Long>, JpaSpecificationExecutor<Operacion> {
    @Query("select o from Operacion o where o.estado not in (1) and o.cliente.id=?1")
    Page<Operacion> recuperaOperacionesPorClientId(Long clienteId, Pageable pageable);
}
