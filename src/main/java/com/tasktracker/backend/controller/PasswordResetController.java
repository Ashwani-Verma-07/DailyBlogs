package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.ForgotPasswordRequest;
import com.tasktracker.backend.dto.ResetPasswordRequest;
import com.tasktracker.backend.service.PasswordResetService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        String message = passwordResetService.forgotPassword(
                request.email()
        );

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        String message = passwordResetService.resetPassword(
                request.token(),
                request.newPassword()
        );

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }
}