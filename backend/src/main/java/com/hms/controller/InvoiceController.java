package com.hms.controller;

import com.hms.dto.InvoiceDto;
import com.hms.dto.InvoiceRequest;
import com.hms.model.Role;
import com.hms.model.User;
import com.hms.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceDto>> list(@AuthenticationPrincipal User user) {
        if (user.getRole() == Role.PATIENT) {
            return ResponseEntity.ok(invoiceService.getForPatient(user));
        }
        return ResponseEntity.ok(invoiceService.getAll());
    }

    @PostMapping
    public ResponseEntity<InvoiceDto> create(@Valid @RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.create(request));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<InvoiceDto> pay(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.pay(id));
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<InvoiceDto> submitClaim(@PathVariable Long id,
                                                   @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(invoiceService.submitClaim(id, body.get("claimNumber")));
    }
}
