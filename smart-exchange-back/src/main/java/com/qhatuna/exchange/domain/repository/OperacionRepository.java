package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.Operacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface OperacionRepository extends JpaRepository<Operacion, Long>, JpaSpecificationExecutor<Operacion> {
    @Query("select o from Operacion o where o.estado not in (1) and o.cliente.id=?1")
    Page<Operacion> recuperaOperacionesPorClientId(Long clienteId, Pageable pageable);
    @Modifying
    @Query("UPDATE Operacion o SET o.ticket = :ticket WHERE o.id = :id")
    void updateTicket(@Param("id") Long id, @Param("ticket") String ticket);
    //Por día
    @Query("select o from Operacion o where o.estado=10 and o.fechaFinalizacion = ?1")
    List<Operacion> recuperaOperacionesPorDia(LocalDate fecha);

    // Por semana
/*    @Query("select o from Operacion o where o.estado=0 and o.fechaFinalizacion >= ?1 and o.fechaFinalizacion < ?1 + 7")
    List<Operacion> recuperaOperacionesPorSemana(LocalDate inicioSemana);*/

    // Por mes
    @Query("select o from Operacion o where o.estado=10 and month(o.fechaFinalizacion) = month(?1) and year(o.fechaFinalizacion) = year(?1)")
    List<Operacion> recuperaOperacionesPorMes(LocalDate fechaDelMes);

    // Por año
    @Query("select o from Operacion o where o.estado=10 and year(o.fechaFinalizacion) = year(?1)")
    List<Operacion> recuperaOperacionesPorAnio(LocalDate fechaDelAno);
    @Query("select o from Operacion o where o.estado=10 and o.fechaFinalizacion >= :fechaInicio and o.fechaFinalizacion <= :fechaFin")
    List<Operacion> recuperaOperacionesEntreFechas(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

}
