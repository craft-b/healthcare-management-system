package com.hms.service;

import com.hms.dto.ReportDto;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.InvoiceRepository;
import com.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;

    public ReportDto generate(LocalDate start, LocalDate end) {
        LocalDateTime from = start.atStartOfDay();
        LocalDateTime to = end.plusDays(1).atStartOfDay();

        ReportDto report = new ReportDto();
        report.setTotalPatients(patientRepository.count());
        report.setTotalAppointments(appointmentRepository.count());
        report.setAppointmentsInPeriod(appointmentRepository.countByPeriod(from, to));
        report.setRevenueInPeriod(invoiceRepository.sumRevenueByPeriod(from, to));
        report.setPeriodStart(start.toString());
        report.setPeriodEnd(end.toString());
        return report;
    }
}
