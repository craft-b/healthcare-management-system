package com.hms.repository;

import com.hms.model.Patient;
import com.hms.model.Prescription;
import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @Query("SELECT p FROM Prescription p JOIN FETCH p.patient JOIN FETCH p.provider ORDER BY p.createdAt DESC")
    List<Prescription> findAllWithDetails();

    @Query("SELECT p FROM Prescription p JOIN FETCH p.patient JOIN FETCH p.provider WHERE p.patient = :patient ORDER BY p.createdAt DESC")
    List<Prescription> findByPatientWithDetails(@Param("patient") Patient patient);

    @Query("SELECT p FROM Prescription p JOIN FETCH p.patient JOIN FETCH p.provider WHERE p.provider = :provider ORDER BY p.createdAt DESC")
    List<Prescription> findByProviderWithDetails(@Param("provider") User provider);
}
