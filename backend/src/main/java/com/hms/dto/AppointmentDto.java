package com.hms.dto;

import com.hms.model.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long providerId;
    private String providerName;
    private LocalDateTime appointmentTime;
    private AppointmentStatus status;
    private String notes;
}
