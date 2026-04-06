package com.hms.controller;

import com.hms.model.Role;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/providers")
    public ResponseEntity<List<Map<String, Object>>> getProviders() {
        List<Map<String, Object>> providers = userRepository.findByRole(Role.PROVIDER)
                .stream()
                .map(u -> Map.<String, Object>of("id", u.getId(), "fullName", u.getFullName()))
                .toList();
        return ResponseEntity.ok(providers);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll()
                .stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "fullName", u.getFullName(),
                        "role", u.getRole().name()
                ))
                .toList();
        return ResponseEntity.ok(users);
    }
}
