package com.hms.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PrescriptionDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long providerId;
    private String providerName;
    private String medicationName;
    private String dosage;
    private String instructions;
    private boolean sentToPharmacy;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
}
