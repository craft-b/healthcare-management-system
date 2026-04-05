package com.hms.repository;

import com.hms.model.Appointment;
import com.hms.model.Patient;
import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentTimeDesc(Patient patient);
    List<Appointment> findByProviderOrderByAppointmentTimeDesc(User provider);
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentTime BETWEEN :start AND :end")
    long countByPeriod(LocalDateTime start, LocalDateTime end);
}
