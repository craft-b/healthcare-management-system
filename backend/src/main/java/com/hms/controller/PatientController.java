package com.hms.controller;

import com.hms.dto.PatientDto;
import com.hms.model.Role;
import com.hms.model.User;
import com.hms.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<List<PatientDto>> list(@AuthenticationPrincipal User user) {
        if (user.getRole() == Role.PATIENT) {
            return ResponseEntity.ok(List.of(patientService.toDto(patientService.getByUser(user))));
        }
        return ResponseEntity.ok(patientService.getAll().stream().map(patientService::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.toDto(patientService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<PatientDto> create(@AuthenticationPrincipal User user,
                                              @RequestBody PatientDto dto) {
        return ResponseEntity.ok(patientService.toDto(patientService.create(user, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDto> update(@PathVariable Long id,
                                              @RequestBody PatientDto dto) {
        return ResponseEntity.ok(patientService.toDto(patientService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
