package com.hms.service;

import com.hms.dto.PatientDto;
import com.hms.model.Patient;
import com.hms.model.User;
import com.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<Patient> getAll() {
        return patientRepository.findAll();
    }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + id));
    }

    public Patient getByUser(User user) {
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found for user"));
    }

    @Transactional
    public Patient create(User user, PatientDto dto) {
        Patient patient = new Patient();
        patient.setUser(user);
        mapDtoToEntity(dto, patient);
        return patientRepository.save(patient);
    }

    @Transactional
    public Patient update(Long id, PatientDto dto) {
        Patient patient = getById(id);
        mapDtoToEntity(dto, patient);
        return patientRepository.save(patient);
    }

    @Transactional
    public void delete(Long id) {
        patientRepository.deleteById(id);
    }

    public PatientDto toDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setFullName(patient.getFullName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setPhone(patient.getPhone());
        dto.setAddress(patient.getAddress());
        dto.setMedicalHistory(patient.getMedicalHistory());
        dto.setAllergies(patient.getAllergies());
        dto.setInsuranceProvider(patient.getInsuranceProvider());
        dto.setInsurancePolicyNumber(patient.getInsurancePolicyNumber());
        return dto;
    }

    private void mapDtoToEntity(PatientDto dto, Patient patient) {
        patient.setFullName(dto.getFullName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setPhone(dto.getPhone());
        patient.setAddress(dto.getAddress());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setAllergies(dto.getAllergies());
        patient.setInsuranceProvider(dto.getInsuranceProvider());
        patient.setInsurancePolicyNumber(dto.getInsurancePolicyNumber());
    }
}
