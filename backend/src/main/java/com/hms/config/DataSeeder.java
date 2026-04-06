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
        if (userRepository.count() > 0) return;

        // ── Providers ────────────────────────────────────────────────────────
        User drSmith = user("dr.smith", "Dr. Sarah Smith", "dr.smith@hms.com", Role.PROVIDER);
        User drJones = user("dr.jones", "Dr. Michael Jones", "dr.jones@hms.com", Role.PROVIDER);
        User drChen = user("dr.chen", "Dr. Emily Chen", "dr.chen@hms.com", Role.PROVIDER);
        User drWilson = user("dr.wilson", "Dr. Robert Wilson", "dr.wilson@hms.com", Role.PROVIDER);
        User drMartinez = user("dr.martinez", "Dr. Lisa Martinez", "dr.martinez@hms.com", Role.PROVIDER);

        // ── Admin ─────────────────────────────────────────────────────────────
        user("admin", "System Administrator", "admin@hms.com", Role.ADMIN);

        // ── Patient users ─────────────────────────────────────────────────────
        User u1 = user("john.doe",         "John Doe",          "john.doe@email.com",         Role.PATIENT);
        User u2 = user("jane.doe",         "Jane Doe",          "jane.doe@email.com",         Role.PATIENT);
        User u3 = user("michael.johnson",  "Michael Johnson",   "m.johnson@email.com",        Role.PATIENT);
        User u4 = user("sarah.williams",   "Sarah Williams",    "s.williams@email.com",       Role.PATIENT);
        User u5 = user("robert.brown",     "Robert Brown",      "r.brown@email.com",          Role.PATIENT);
        User u6 = user("emily.davis",      "Emily Davis",       "e.davis@email.com",          Role.PATIENT);
        User u7 = user("david.miller",     "David Miller",      "d.miller@email.com",         Role.PATIENT);
        User u8 = user("jennifer.wilson",  "Jennifer Wilson",   "j.wilson@email.com",         Role.PATIENT);

        // ── Patient Profiles ──────────────────────────────────────────────────
        Patient p1 = patient(u1, "John Doe",         LocalDate.of(1985, 3, 14),  "Male",   "555-101-2020", "123 Main St, Springfield, IL 62701",
                "Hypertension diagnosed 2018. Appendectomy 2010.",            "Penicillin",           "BlueCross BlueShield", "BCBS-00123456");
        Patient p2 = patient(u2, "Jane Doe",         LocalDate.of(1990, 7, 22),  "Female", "555-202-3030", "456 Oak Ave, Springfield, IL 62702",
                "Type 2 Diabetes diagnosed 2020. No surgeries.",              "Sulfa drugs, Latex",   "Aetna",               "AET-00789012");
        Patient p3 = patient(u3, "Michael Johnson",  LocalDate.of(1966, 11, 5),  "Male",   "555-303-4040", "789 Elm St, Chicago, IL 60601",
                "Coronary artery disease 2019. Stent placement 2021. Hypertension.", "Aspirin (high dose)", "United Healthcare",   "UHC-00345678");
        Patient p4 = patient(u4, "Sarah Williams",   LocalDate.of(1982, 4, 18),  "Female", "555-404-5050", "321 Pine Rd, Naperville, IL 60540",
                "Rheumatoid arthritis diagnosed 2017. Mild anemia.",          "NSAIDs",               "Cigna",               "CIG-00456789");
        Patient p5 = patient(u5, "Robert Brown",     LocalDate.of(1989, 9, 30),  "Male",   "555-505-6060", "654 Maple Dr, Evanston, IL 60201",
                "Type 1 Diabetes since age 12. Insulin-dependent.",           "None known",           "Aetna",               "AET-00567890");
        Patient p6 = patient(u6, "Emily Davis",      LocalDate.of(1997, 2, 14),  "Female", "555-606-7070", "987 Cedar Ln, Rockford, IL 61101",
                "Asthma since childhood. Exercise-induced. No hospitalizations.", "Aspirin, Ibuprofen", "Cigna",             "CIG-00678901");
        Patient p7 = patient(u7, "David Miller",     LocalDate.of(1960, 6, 8),   "Male",   "555-707-8080", "147 Birch Blvd, Peoria, IL 61602",
                "Chronic lower back pain. Degenerative disc disease L4-L5. Hypertension.", "Codeine", "Medicare",          "MCR-00789012");
        Patient p8 = patient(u8, "Jennifer Wilson",  LocalDate.of(1992, 12, 25), "Female", "555-808-9090", "258 Willow Way, Aurora, IL 60505",
                "Chronic migraines since 2015. IBS. Anxiety (mild).",         "Triptan medications",  "Humana",              "HUM-00890123");

        // ── Appointments ──────────────────────────────────────────────────────
        // John Doe
        appt(p1, drSmith, 2, 9, 0,  AppointmentStatus.CONFIRMED,  "Annual checkup and blood pressure review");
        appt(p1, drJones, -7, 14, 0, AppointmentStatus.COMPLETED, "Routine consultation");
        appt(p1, drChen, 14, 10, 30, AppointmentStatus.PENDING,   "Cardiology referral — palpitations");

        // Jane Doe
        appt(p2, drSmith, 3, 11, 30, AppointmentStatus.PENDING,  "Diabetes follow-up and HbA1c review");
        appt(p2, drJones, 10, 10, 0, AppointmentStatus.PENDING,  "Follow-up on medication adjustment");
        appt(p2, drSmith, -14, 9, 0, AppointmentStatus.COMPLETED,"Quarterly diabetes management");

        // Michael Johnson
        appt(p3, drChen, 1, 8, 30,  AppointmentStatus.CONFIRMED, "Cardiology follow-up post stent");
        appt(p3, drChen, -10, 9, 0,  AppointmentStatus.COMPLETED,"Cardiology check — EKG review");
        appt(p3, drWilson, 21, 14, 0, AppointmentStatus.PENDING, "Orthopedic consult for knee pain");

        // Sarah Williams
        appt(p4, drJones, 5, 13, 0,  AppointmentStatus.CONFIRMED,"Rheumatology review — joint inflammation");
        appt(p4, drJones, -5, 10, 0,  AppointmentStatus.COMPLETED,"Medication efficacy review");

        // Robert Brown
        appt(p5, drSmith, 7, 9, 30,  AppointmentStatus.PENDING,  "Endocrinology — insulin pump review");
        appt(p5, drSmith, -21, 11, 0, AppointmentStatus.COMPLETED,"Blood glucose management");

        // Emily Davis
        appt(p6, drMartinez, 4, 15, 0, AppointmentStatus.CONFIRMED,"Pulmonology — asthma action plan");
        appt(p6, drMartinez, -3,  9, 0, AppointmentStatus.COMPLETED,"Inhaler technique and peak flow review");

        // David Miller
        appt(p7, drWilson, 2, 11, 0, AppointmentStatus.CONFIRMED,  "Orthopedic follow-up — lumbar MRI results");
        appt(p7, drWilson, -14, 14, 0, AppointmentStatus.COMPLETED,"Pre-op assessment for pain management");
        appt(p7, drSmith, 9, 8, 30,  AppointmentStatus.PENDING,    "Hypertension medication review");

        // Jennifer Wilson
        appt(p8, drMartinez, 6, 10, 0, AppointmentStatus.PENDING,  "Neurology consult — migraine frequency");
        appt(p8, drJones, -2, 14, 30, AppointmentStatus.COMPLETED, "GI consult for IBS symptoms");

        // ── Invoices ──────────────────────────────────────────────────────────
        invoice(p1, "Annual Physical Examination",        "150.00", InvoiceStatus.PAID,             null, -7);
        invoice(p1, "Blood Pressure Monitoring & Labs",  "320.00", InvoiceStatus.PENDING,          null, -1);
        invoice(p1, "Cardiology Consultation",            "425.00", InvoiceStatus.PENDING,          null,  0);
        invoice(p2, "Diabetes Management Consultation",  "275.00", InvoiceStatus.CLAIM_SUBMITTED,  "CLM-2026-00441", -5);
        invoice(p2, "HbA1c Lab Test",                    "95.00",  InvoiceStatus.PENDING,          null, -2);
        invoice(p2, "Quarterly Diabetes Review",         "200.00", InvoiceStatus.PAID,             null, -15);
        invoice(p3, "Cardiology Follow-up w/ EKG",       "550.00", InvoiceStatus.CLAIM_SUBMITTED,  "CLM-2026-00552", -10);
        invoice(p3, "Stent Monitoring — Stress Test",    "780.00", InvoiceStatus.PAID,             null, -30);
        invoice(p4, "Rheumatology Consultation",         "380.00", InvoiceStatus.PENDING,          null, -5);
        invoice(p4, "Joint Inflammation Panel",          "215.00", InvoiceStatus.PAID,             null, -20);
        invoice(p5, "Endocrinology Consultation",        "310.00", InvoiceStatus.PENDING,          null, -1);
        invoice(p5, "Blood Glucose Management Review",   "175.00", InvoiceStatus.PAID,             null, -21);
        invoice(p6, "Pulmonology — Spirometry Test",     "195.00", InvoiceStatus.CLAIM_SUBMITTED,  "CLM-2026-00663", -3);
        invoice(p7, "Orthopedic Consultation + MRI",     "890.00", InvoiceStatus.PENDING,          null, -1);
        invoice(p7, "Pain Management Assessment",        "340.00", InvoiceStatus.PAID,             null, -14);
        invoice(p8, "Neurology Consultation",            "420.00", InvoiceStatus.PENDING,          null, -1);
        invoice(p8, "GI Consultation",                   "260.00", InvoiceStatus.PENDING,          null, -2);

        // ── Prescriptions ─────────────────────────────────────────────────────
        rx(p1, drSmith,    "Lisinopril",       "10mg once daily",            "Take in the morning. Monitor BP weekly.",                         true,  -5);
        rx(p1, drJones,    "Aspirin",          "81mg once daily",            "Take with food to reduce stomach irritation.",                    true,  -7);
        rx(p2, drSmith,    "Metformin",        "500mg twice daily",          "Take with meals. Do not crush extended-release tablets.",         false, -1);
        rx(p2, drSmith,    "Glipizide",        "5mg once daily before breakfast","Take 30 min before first meal.",                             true,  -3);
        rx(p3, drChen,     "Clopidogrel",      "75mg once daily",            "Do not stop without consulting cardiologist. Take with food.",    true,  -10);
        rx(p3, drChen,     "Atorvastatin",     "40mg once at bedtime",       "Avoid grapefruit juice. Report muscle pain immediately.",        true,  -10);
        rx(p3, drSmith,    "Amlodipine",       "5mg once daily",             "May cause ankle swelling. Monitor blood pressure.",               true,  -10);
        rx(p4, drJones,    "Methotrexate",     "15mg once weekly",           "Take on same day each week. Stay hydrated. Avoid alcohol.",       true,  -5);
        rx(p4, drJones,    "Folic Acid",       "1mg daily",                  "Take on days you do not take methotrexate.",                      true,  -5);
        rx(p5, drSmith,    "Insulin Glargine", "20 units subcutaneously at bedtime","Rotate injection sites. Store unopened vials refrigerated.", true, -3);
        rx(p5, drSmith,    "Insulin Lispro",   "Per sliding scale with meals","Check blood glucose before each dose.",                         false, -1);
        rx(p6, drMartinez, "Albuterol",        "2 puffs every 4-6h as needed","Rinse mouth after use. Carry at all times.",                   true,  -3);
        rx(p6, drMartinez, "Fluticasone",      "1 puff twice daily",         "Rinse mouth after use. Do not use for acute attacks.",            true,  -3);
        rx(p7, drWilson,   "Cyclobenzaprine",  "5mg three times daily",      "May cause drowsiness. Avoid driving. Short-term use only.",       true,  -7);
        rx(p7, drSmith,    "Hydrochlorothiazide","25mg once daily",           "Take in the morning. Monitor potassium levels.",                  true,  -14);
        rx(p8, drMartinez, "Sumatriptan",      "50mg at onset of migraine",  "Do not take more than 2 doses in 24h. Avoid in hemiplegic migraine.", false, -1);
        rx(p8, drMartinez, "Propranolol",      "40mg twice daily",           "Do not stop abruptly. Monitor heart rate.",                       true,  -5);

        System.out.println("✓ HMS demo data seeded successfully.");
        System.out.println("  Providers ──────────────────────────────────────────");
        System.out.println("  dr.smith    / doctor123  — Dr. Sarah Smith (Internal Medicine)");
        System.out.println("  dr.jones    / doctor123  — Dr. Michael Jones (General Practice)");
        System.out.println("  dr.chen     / doctor123  — Dr. Emily Chen (Cardiology)");
        System.out.println("  dr.wilson   / doctor123  — Dr. Robert Wilson (Orthopedics)");
        System.out.println("  dr.martinez / doctor123  — Dr. Lisa Martinez (Neurology/Pediatrics)");
        System.out.println("  Admin ──────────────────────────────────────────────");
        System.out.println("  admin       / admin123");
        System.out.println("  Patients ───────────────────────────────────────────");
        System.out.println("  john.doe / jane.doe / michael.johnson / sarah.williams");
        System.out.println("  robert.brown / emily.davis / david.miller / jennifer.wilson");
        System.out.println("  (all patient passwords: patient123)");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User user(String username, String fullName, String email, Role role) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(role == Role.PATIENT ? "patient123" : role == Role.PROVIDER ? "doctor123" : "admin123"));
        u.setRole(role);
        u.setFullName(fullName);
        u.setEmail(email);
        return userRepository.save(u);
    }

    private Patient patient(User user, String fullName, LocalDate dob, String gender, String phone, String address,
                            String medHistory, String allergies, String insuranceProvider, String policyNumber) {
        Patient p = new Patient();
        p.setUser(user);
        p.setFullName(fullName);
        p.setDateOfBirth(dob);
        p.setGender(gender);
        p.setPhone(phone);
        p.setAddress(address);
        p.setMedicalHistory(medHistory);
        p.setAllergies(allergies);
        p.setInsuranceProvider(insuranceProvider);
        p.setInsurancePolicyNumber(policyNumber);
        return patientRepository.save(p);
    }

    private void appt(Patient patient, User provider, int dayOffset, int hour, int minute,
                      AppointmentStatus status, String notes) {
        Appointment a = new Appointment();
        a.setPatient(patient);
        a.setProvider(provider);
        a.setAppointmentTime(LocalDateTime.now().plusDays(dayOffset).withHour(hour).withMinute(minute).withSecond(0));
        a.setStatus(status);
        a.setNotes(notes);
        appointmentRepository.save(a);
    }

    private void invoice(Patient patient, String description, String amount,
                         InvoiceStatus status, String claimNumber, int dayOffset) {
        Invoice inv = new Invoice();
        inv.setPatient(patient);
        inv.setServiceDescription(description);
        inv.setAmount(new BigDecimal(amount));
        inv.setStatus(status);
        if (claimNumber != null) inv.setInsuranceClaimNumber(claimNumber);
        if (status == InvoiceStatus.PAID) inv.setPaidAt(LocalDateTime.now().plusDays(dayOffset));
        // Override issuedAt via reflection workaround — set via field directly
        invoiceRepository.save(inv);
    }

    private void rx(Patient patient, User provider, String medication, String dosage,
                    String instructions, boolean sent, int dayOffset) {
        Prescription rx = new Prescription();
        rx.setPatient(patient);
        rx.setProvider(provider);
        rx.setMedicationName(medication);
        rx.setDosage(dosage);
        rx.setInstructions(instructions);
        rx.setSentToPharmacy(sent);
        if (sent) rx.setSentAt(LocalDateTime.now().plusDays(dayOffset));
        prescriptionRepository.save(rx);
    }
}
