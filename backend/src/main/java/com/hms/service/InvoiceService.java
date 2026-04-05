package com.hms.service;

import com.hms.dto.InvoiceDto;
import com.hms.dto.InvoiceRequest;
import com.hms.model.*;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PatientService patientService;
    private final AppointmentRepository appointmentRepository;

    public List<InvoiceDto> getForPatient(User user) {
        Patient patient = patientService.getByUser(user);
        return invoiceRepository.findByPatientOrderByIssuedAtDesc(patient)
                .stream().map(this::toDto).toList();
    }

    public List<InvoiceDto> getAll() {
        return invoiceRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public InvoiceDto create(InvoiceRequest request) {
        Patient patient = patientService.getById(request.getPatientId());
        Invoice invoice = new Invoice();
        invoice.setPatient(patient);
        invoice.setServiceDescription(request.getServiceDescription());
        invoice.setAmount(request.getAmount());

        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
            invoice.setAppointment(appointment);
        }

        return toDto(invoiceRepository.save(invoice));
    }

    @Transactional
    public InvoiceDto pay(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        return toDto(invoiceRepository.save(invoice));
    }

    @Transactional
    public InvoiceDto submitClaim(Long id, String claimNumber) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        invoice.setStatus(InvoiceStatus.CLAIM_SUBMITTED);
        invoice.setInsuranceClaimNumber(claimNumber);
        return toDto(invoiceRepository.save(invoice));
    }

    public InvoiceDto toDto(Invoice i) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(i.getId());
        dto.setPatientId(i.getPatient().getId());
        dto.setPatientName(i.getPatient().getFullName());
        if (i.getAppointment() != null) dto.setAppointmentId(i.getAppointment().getId());
        dto.setServiceDescription(i.getServiceDescription());
        dto.setAmount(i.getAmount());
        dto.setStatus(i.getStatus());
        dto.setInsuranceClaimNumber(i.getInsuranceClaimNumber());
        dto.setIssuedAt(i.getIssuedAt());
        dto.setPaidAt(i.getPaidAt());
        return dto;
    }
}
