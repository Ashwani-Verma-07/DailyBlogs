package com.tasktracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String message;

    private Long userId;

    private String name;

    private String email;

    private String role;

    private String token;
}
