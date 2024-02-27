package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.TipoCambio;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TipoCambioRepository extends JpaRepository<TipoCambio, Long> {
    /*@Query("select tc from TipoCambio tc where tc.moneda = ?1 and tc.tipo=?2 and tc.fecha = ?3 and tc.estado = 0")
    Optional<TipoCambio> buscaTipoDeCambioPorMonedaYFecha(Integer moneda,Integer tipo, LocalDate fecha);*/
    @Query("select tc from TipoCambio tc where tc.moneda = ?1 and tc.tipo=?2 and tc.fecha <= ?3 and tc.estado = 0 order by tc.fecha desc")
    List<TipoCambio> buscaTipoDeCambioRecientePorMonedaYTipo(Integer moneda, Integer tipo, LocalDate fecha, Pageable pageable);
    @Query("select tc from TipoCambio tc where tc.moneda = ?1 and tc.tipo=?2 and tc.estado = 0 order by tc.fecha desc")
    List<TipoCambio> buscaTipoDeCambioRecientePorMonedaYTipo(Integer moneda, Integer tipo, Pageable pageable);


    @Query("select tc from TipoCambio tc where tc.moneda = ?1 and tc.tipo=?2 and tc.estado = 0 and tc.fecha <= ?3")
    List<TipoCambio> buscaTipoDeCambioPorMoneda(Integer moneda, Integer tipo, LocalDate fecha);
    @Query("select tc from TipoCambio tc where tc.moneda = ?1 and tc.tipo=?2 and tc.estado = 0 and tc.fecha = ?3")
    List<TipoCambio> buscaTipoDeCambioPorMonedaYFechaDespues(Integer moneda, Integer tipo, LocalDate fecha);
    @Query("select tc from TipoCambio tc where tc.moneda = ?1 and tc.estado = 0")
    Optional<TipoCambio> buscaTipoDeCambioPorMoneda(Integer moneda);

    @Query("select tc from TipoCambio tc where tc.moneda = ?1 and tc.estado = 0 and tc.fecha >= ?2 and tc.fecha <= ?3")
    List<TipoCambio> buscaTipoDeCambioPorMonedaYFechas(Integer moneda, LocalDate desde, LocalDate hasta);
}
