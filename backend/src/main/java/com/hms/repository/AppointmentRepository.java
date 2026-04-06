package com.hms.repository;

import com.hms.model.Appointment;
import com.hms.model.Patient;
import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.provider ORDER BY a.appointmentTime DESC")
    List<Appointment> findAllWithDetails();

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.provider WHERE a.patient = :patient ORDER BY a.appointmentTime DESC")
    List<Appointment> findByPatientWithDetails(@Param("patient") Patient patient);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.provider WHERE a.provider = :provider ORDER BY a.appointmentTime DESC")
    List<Appointment> findByProviderWithDetails(@Param("provider") User provider);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentTime BETWEEN :start AND :end")
    long countByPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
