package com.hms.dto;

import com.hms.model.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InvoiceDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long appointmentId;
    private String serviceDescription;
    private BigDecimal amount;
    private InvoiceStatus status;
    private String insuranceClaimNumber;
    private LocalDateTime issuedAt;
    private LocalDateTime paidAt;
}
