package com.hms.controller;

import com.hms.model.Role;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list() {
        List<Map<String, Object>> providers = userRepository.findByRole(Role.PROVIDER)
                .stream()
                .map(u -> Map.<String, Object>of("id", u.getId(), "fullName", u.getFullName()))
                .toList();
        return ResponseEntity.ok(providers);
    }
}
