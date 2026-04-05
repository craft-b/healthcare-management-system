package com.hms.controller;

import com.hms.dto.PrescriptionDto;
import com.hms.dto.PrescriptionRequest;
import com.hms.model.Role;
import com.hms.model.User;
import com.hms.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @GetMapping
    public ResponseEntity<List<PrescriptionDto>> list(@AuthenticationPrincipal User user) {
        if (user.getRole() == Role.PATIENT) {
            return ResponseEntity.ok(prescriptionService.getForPatient(user));
        } else if (user.getRole() == Role.PROVIDER) {
            return ResponseEntity.ok(prescriptionService.getForProvider(user));
        }
        return ResponseEntity.ok(prescriptionService.getAll());
    }

    @PostMapping
    public ResponseEntity<PrescriptionDto> create(@AuthenticationPrincipal User user,
                                                   @Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.create(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDto> update(@PathVariable Long id,
                                                   @Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.update(id, request));
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<PrescriptionDto> send(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.sendToPharmacy(id));
    }
}
