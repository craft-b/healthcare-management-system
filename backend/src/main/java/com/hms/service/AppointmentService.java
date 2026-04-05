package com.hms.service;

import com.hms.dto.AppointmentDto;
import com.hms.dto.AppointmentRequest;
import com.hms.model.*;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService;
    private final UserRepository userRepository;

    public List<AppointmentDto> getForPatient(User user) {
        Patient patient = patientService.getByUser(user);
        return appointmentRepository.findByPatientOrderByAppointmentTimeDesc(patient)
                .stream().map(this::toDto).toList();
    }

    public List<AppointmentDto> getForProvider(User provider) {
        return appointmentRepository.findByProviderOrderByAppointmentTimeDesc(provider)
                .stream().map(this::toDto).toList();
    }

    public List<AppointmentDto> getAll() {
        return appointmentRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public AppointmentDto create(User user, AppointmentRequest request) {
        Patient patient = patientService.getByUser(user);
        User provider = userRepository.findById(request.getProviderId())
                .filter(u -> u.getRole() == Role.PROVIDER)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setProvider(provider);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setNotes(request.getNotes());
        return toDto(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDto updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        appointment.setStatus(status);
        return toDto(appointmentRepository.save(appointment));
    }

    @Transactional
    public void cancel(Long id) {
        updateStatus(id, AppointmentStatus.CANCELLED);
    }

    public AppointmentDto toDto(Appointment a) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(a.getId());
        dto.setPatientId(a.getPatient().getId());
        dto.setPatientName(a.getPatient().getFullName());
        dto.setProviderId(a.getProvider().getId());
        dto.setProviderName(a.getProvider().getFullName());
        dto.setAppointmentTime(a.getAppointmentTime());
        dto.setStatus(a.getStatus());
        dto.setNotes(a.getNotes());
        return dto;
    }
}
