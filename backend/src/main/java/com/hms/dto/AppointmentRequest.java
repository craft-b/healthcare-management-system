package com.hms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull
    private Long providerId;

    @NotNull
    private LocalDateTime appointmentTime;

    private String notes;
}
