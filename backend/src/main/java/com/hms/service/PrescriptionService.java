package com.hms.service;

import com.hms.dto.PrescriptionDto;
import com.hms.dto.PrescriptionRequest;
import com.hms.model.Patient;
import com.hms.model.Prescription;
import com.hms.model.User;
import com.hms.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientService patientService;

    @Transactional(readOnly = true)
    public List<PrescriptionDto> getForPatient(User user) {
        Patient patient = patientService.getByUser(user);
        return prescriptionRepository.findByPatientWithDetails(patient)
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PrescriptionDto> getForProvider(User provider) {
        return prescriptionRepository.findByProviderWithDetails(provider)
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PrescriptionDto> getAll() {
        return prescriptionRepository.findAllWithDetails().stream().map(this::toDto).toList();
    }

    @Transactional
    public PrescriptionDto create(User provider, PrescriptionRequest request) {
        Patient patient = patientService.getById(request.getPatientId());
        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setProvider(provider);
        prescription.setMedicationName(request.getMedicationName());
        prescription.setDosage(request.getDosage());
        prescription.setInstructions(request.getInstructions());
        return toDto(prescriptionRepository.save(prescription));
    }

    @Transactional
    public PrescriptionDto sendToPharmacy(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));
        prescription.setSentToPharmacy(true);
        prescription.setSentAt(LocalDateTime.now());
        return toDto(prescriptionRepository.save(prescription));
    }

    @Transactional
    public void delete(Long id) {
        prescriptionRepository.deleteById(id);
    }

    @Transactional
    public PrescriptionDto update(Long id, PrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));
        prescription.setMedicationName(request.getMedicationName());
        prescription.setDosage(request.getDosage());
        prescription.setInstructions(request.getInstructions());
        return toDto(prescriptionRepository.save(prescription));
    }

    public PrescriptionDto toDto(Prescription p) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(p.getId());
        dto.setPatientId(p.getPatient().getId());
        dto.setPatientName(p.getPatient().getFullName());
        dto.setProviderId(p.getProvider().getId());
        dto.setProviderName(p.getProvider().getFullName());
        dto.setMedicationName(p.getMedicationName());
        dto.setDosage(p.getDosage());
        dto.setInstructions(p.getInstructions());
        dto.setSentToPharmacy(p.isSentToPharmacy());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setSentAt(p.getSentAt());
        return dto;
    }
}
