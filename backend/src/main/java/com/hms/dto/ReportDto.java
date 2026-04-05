package com.hms.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ReportDto {
    private long totalPatients;
    private long totalAppointments;
    private long appointmentsInPeriod;
    private BigDecimal revenueInPeriod;
    private String periodStart;
    private String periodEnd;
}
