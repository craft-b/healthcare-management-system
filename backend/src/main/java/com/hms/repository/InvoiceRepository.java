package com.hms.repository;

import com.hms.model.Invoice;
import com.hms.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT i FROM Invoice i JOIN FETCH i.patient LEFT JOIN FETCH i.appointment ORDER BY i.issuedAt DESC")
    List<Invoice> findAllWithDetails();

    @Query("SELECT i FROM Invoice i JOIN FETCH i.patient LEFT JOIN FETCH i.appointment WHERE i.patient = :patient ORDER BY i.issuedAt DESC")
    List<Invoice> findByPatientWithDetails(@Param("patient") Patient patient);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Invoice i WHERE i.issuedAt BETWEEN :start AND :end")
    BigDecimal sumRevenueByPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
