package com.hms.config;

import com.hms.model.*;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if DB is empty
        if (userRepository.count() > 0) return;

        // ── Users ────────────────────────────────────────────────────────────
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setFullName("System Administrator");
        admin.setEmail("admin@hms.com");
        userRepository.save(admin);

        User provider = new User();
        provider.setUsername("dr.smith");
        provider.setPassword(passwordEncoder.encode("doctor123"));
        provider.setRole(Role.PROVIDER);
        provider.setFullName("Dr. Sarah Smith");
        provider.setEmail("dr.smith@hms.com");
        userRepository.save(provider);

        User provider2 = new User();
        provider2.setUsername("dr.jones");
        provider2.setPassword(passwordEncoder.encode("doctor123"));
        provider2.setRole(Role.PROVIDER);
        provider2.setFullName("Dr. Michael Jones");
        provider2.setEmail("dr.jones@hms.com");
        userRepository.save(provider2);

        User patientUser1 = new User();
        patientUser1.setUsername("john.doe");
        patientUser1.setPassword(passwordEncoder.encode("patient123"));
        patientUser1.setRole(Role.PATIENT);
        patientUser1.setFullName("John Doe");
        patientUser1.setEmail("john.doe@email.com");
        userRepository.save(patientUser1);

        User patientUser2 = new User();
        patientUser2.setUsername("jane.doe");
        patientUser2.setPassword(passwordEncoder.encode("patient123"));
        patientUser2.setRole(Role.PATIENT);
        patientUser2.setFullName("Jane Doe");
        patientUser2.setEmail("jane.doe@email.com");
        userRepository.save(patientUser2);

        // ── Patient Profiles ─────────────────────────────────────────────────
        Patient patient1 = new Patient();
        patient1.setUser(patientUser1);
        patient1.setFullName("John Doe");
        patient1.setDateOfBirth(LocalDate.of(1985, 3, 14));
        patient1.setGender("Male");
        patient1.setPhone("555-101-2020");
        patient1.setAddress("123 Main St, Springfield, IL 62701");
        patient1.setMedicalHistory("Hypertension diagnosed 2018. Appendectomy 2010.");
        patient1.setAllergies("Penicillin");
        patient1.setInsuranceProvider("BlueCross BlueShield");
        patient1.setInsurancePolicyNumber("BCBS-00123456");
        patientRepository.save(patient1);

        Patient patient2 = new Patient();
        patient2.setUser(patientUser2);
        patient2.setFullName("Jane Doe");
        patient2.setDateOfBirth(LocalDate.of(1990, 7, 22));
        patient2.setGender("Female");
        patient2.setPhone("555-202-3030");
        patient2.setAddress("456 Oak Ave, Springfield, IL 62702");
        patient2.setMedicalHistory("Type 2 Diabetes diagnosed 2020. No surgeries.");
        patient2.setAllergies("Sulfa drugs, Latex");
        patient2.setInsuranceProvider("Aetna");
        patient2.setInsurancePolicyNumber("AET-00789012");
        patientRepository.save(patient2);

        // ── Appointments ─────────────────────────────────────────────────────
        Appointment apt1 = new Appointment();
        apt1.setPatient(patient1);
        apt1.setProvider(provider);
        apt1.setAppointmentTime(LocalDateTime.now().plusDays(2).withHour(9).withMinute(0));
        apt1.setStatus(AppointmentStatus.CONFIRMED);
        apt1.setNotes("Annual checkup and blood pressure review");
        appointmentRepository.save(apt1);

        Appointment apt2 = new Appointment();
        apt2.setPatient(patient2);
        apt2.setProvider(provider);
        apt2.setAppointmentTime(LocalDateTime.now().plusDays(3).withHour(11).withMinute(30));
        apt2.setStatus(AppointmentStatus.PENDING);
        apt2.setNotes("Diabetes follow-up and HbA1c review");
        appointmentRepository.save(apt2);

        Appointment apt3 = new Appointment();
        apt3.setPatient(patient1);
        apt3.setProvider(provider2);
        apt3.setAppointmentTime(LocalDateTime.now().minusDays(7).withHour(14).withMinute(0));
        apt3.setStatus(AppointmentStatus.COMPLETED);
        apt3.setNotes("Routine consultation");
        appointmentRepository.save(apt3);

        Appointment apt4 = new Appointment();
        apt4.setPatient(patient2);
        apt4.setProvider(provider2);
        apt4.setAppointmentTime(LocalDateTime.now().plusDays(10).withHour(10).withMinute(0));
        apt4.setStatus(AppointmentStatus.PENDING);
        apt4.setNotes("Follow-up on medication adjustment");
        appointmentRepository.save(apt4);

        // ── Invoices ─────────────────────────────────────────────────────────
        Invoice inv1 = new Invoice();
        inv1.setPatient(patient1);
        inv1.setAppointment(apt3);
        inv1.setServiceDescription("Routine Consultation");
        inv1.setAmount(new BigDecimal("150.00"));
        inv1.setStatus(InvoiceStatus.PAID);
        inv1.setPaidAt(LocalDateTime.now().minusDays(6));
        invoiceRepository.save(inv1);

        Invoice inv2 = new Invoice();
        inv2.setPatient(patient1);
        inv2.setServiceDescription("Blood Pressure Monitoring & Lab Tests");
        inv2.setAmount(new BigDecimal("320.00"));
        inv2.setStatus(InvoiceStatus.PENDING);
        invoiceRepository.save(inv2);

        Invoice inv3 = new Invoice();
        inv3.setPatient(patient2);
        inv3.setServiceDescription("Diabetes Management Consultation");
        inv3.setAmount(new BigDecimal("275.00"));
        inv3.setStatus(InvoiceStatus.CLAIM_SUBMITTED);
        inv3.setInsuranceClaimNumber("CLM-2026-00441");
        invoiceRepository.save(inv3);

        Invoice inv4 = new Invoice();
        inv4.setPatient(patient2);
        inv4.setServiceDescription("HbA1c Lab Test");
        inv4.setAmount(new BigDecimal("95.00"));
        inv4.setStatus(InvoiceStatus.PENDING);
        invoiceRepository.save(inv4);

        // ── Prescriptions ─────────────────────────────────────────────────────
        Prescription rx1 = new Prescription();
        rx1.setPatient(patient1);
        rx1.setProvider(provider);
        rx1.setMedicationName("Lisinopril");
        rx1.setDosage("10mg once daily");
        rx1.setInstructions("Take in the morning with or without food. Monitor blood pressure weekly.");
        rx1.setSentToPharmacy(true);
        rx1.setSentAt(LocalDateTime.now().minusDays(5));
        prescriptionRepository.save(rx1);

        Prescription rx2 = new Prescription();
        rx2.setPatient(patient1);
        rx2.setProvider(provider2);
        rx2.setMedicationName("Aspirin");
        rx2.setDosage("81mg once daily");
        rx2.setInstructions("Take with food to reduce stomach irritation.");
        rx2.setSentToPharmacy(true);
        rx2.setSentAt(LocalDateTime.now().minusDays(7));
        prescriptionRepository.save(rx2);

        Prescription rx3 = new Prescription();
        rx3.setPatient(patient2);
        rx3.setProvider(provider);
        rx3.setMedicationName("Metformin");
        rx3.setDosage("500mg twice daily");
        rx3.setInstructions("Take with meals. Do not crush or chew extended-release tablets.");
        rx3.setSentToPharmacy(false);
        prescriptionRepository.save(rx3);

        Prescription rx4 = new Prescription();
        rx4.setPatient(patient2);
        rx4.setProvider(provider);
        rx4.setMedicationName("Glipizide");
        rx4.setDosage("5mg once daily before breakfast");
        rx4.setInstructions("Take 30 minutes before the first meal of the day.");
        rx4.setSentToPharmacy(true);
        rx4.setSentAt(LocalDateTime.now().minusDays(3));
        prescriptionRepository.save(rx4);

        System.out.println("✓ Demo data seeded successfully.");
        System.out.println("  admin      / admin123");
        System.out.println("  dr.smith   / doctor123  (Provider)");
        System.out.println("  dr.jones   / doctor123  (Provider)");
        System.out.println("  john.doe   / patient123 (Patient)");
        System.out.println("  jane.doe   / patient123 (Patient)");
    }
}
