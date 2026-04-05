package com.hms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientDto {
    private Long id;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String address;
    private String medicalHistory;
    private String allergies;
    private String insuranceProvider;
    private String insurancePolicyNumber;
}
