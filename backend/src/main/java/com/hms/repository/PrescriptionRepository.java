package com.hms.repository;

import com.hms.model.Patient;
import com.hms.model.Prescription;
import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientOrderByCreatedAtDesc(Patient patient);
    List<Prescription> findByProviderOrderByCreatedAtDesc(User provider);
}
