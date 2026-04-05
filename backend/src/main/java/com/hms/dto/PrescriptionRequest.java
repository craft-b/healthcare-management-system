package com.hms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PrescriptionRequest {
    @NotNull
    private Long patientId;

    @NotBlank
    private String medicationName;

    @NotBlank
    private String dosage;

    @NotBlank
    private String instructions;
}
