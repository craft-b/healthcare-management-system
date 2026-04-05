package com.hms.dto;

import com.hms.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    @NotBlank
    private String fullName;

    private String email;
}
