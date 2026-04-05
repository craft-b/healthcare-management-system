package com.hms.repository;

import com.hms.model.Invoice;
import com.hms.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByPatientOrderByIssuedAtDesc(Patient patient);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Invoice i WHERE i.issuedAt BETWEEN :start AND :end")
    BigDecimal sumRevenueByPeriod(LocalDateTime start, LocalDateTime end);
}
