package com.hms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceRequest {
    @NotNull
    private Long patientId;

    private Long appointmentId;

    @NotBlank
    private String serviceDescription;

    @NotNull
    @Positive
    private BigDecimal amount;
}
