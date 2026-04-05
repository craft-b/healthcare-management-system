package com.hms.controller;

import com.hms.dto.AppointmentDto;
import com.hms.dto.AppointmentRequest;
import com.hms.model.AppointmentStatus;
import com.hms.model.Role;
import com.hms.model.User;
import com.hms.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentDto>> list(@AuthenticationPrincipal User user) {
        if (user.getRole() == Role.PATIENT) {
            return ResponseEntity.ok(appointmentService.getForPatient(user));
        } else if (user.getRole() == Role.PROVIDER) {
            return ResponseEntity.ok(appointmentService.getForProvider(user));
        }
        return ResponseEntity.ok(appointmentService.getAll());
    }

    @PostMapping
    public ResponseEntity<AppointmentDto> create(@AuthenticationPrincipal User user,
                                                  @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.create(user, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentDto> updateStatus(@PathVariable Long id,
                                                        @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        appointmentService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
