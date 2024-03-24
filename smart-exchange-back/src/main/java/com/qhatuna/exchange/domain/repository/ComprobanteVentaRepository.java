package com.qhatuna.exchange.domain.repository;

import com.qhatuna.exchange.domain.model.ComprobanteVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ComprobanteVentaRepository extends JpaRepository<ComprobanteVenta, Long> {
    @Query("SELECT MAX(cv.nroFactura) FROM ComprobanteVenta cv")
    Integer findMaxNroFactura();

    @Query("SELECT MAX(cv.nroComprobante) FROM ComprobanteVenta cv")
    Integer findMaxNroComprobante();
}
