package com.hms.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Column(name = "medication_name", nullable = false, length = 150)
    private String medicationName;

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "sent_to_pharmacy", nullable = false)
    private boolean sentToPharmacy = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
}
