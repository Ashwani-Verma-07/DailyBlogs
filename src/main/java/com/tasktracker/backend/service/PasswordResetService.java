package com.tasktracker.backend.service;

import com.tasktracker.backend.entity.AuthProvider;
import com.tasktracker.backend.entity.PasswordResetToken;
import com.tasktracker.backend.entity.User;
import com.tasktracker.backend.repository.PasswordResetTokenRepository;
import com.tasktracker.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private static final String GENERIC_MESSAGE =
            "If an eligible account exists, a password reset email has been sent.";

    @Transactional
    public String forgotPassword(String email) {

        String normalizedEmail = email.trim().toLowerCase();

        Optional<User> optionalUser =
                userRepository.findByEmail(normalizedEmail);

        if (optionalUser.isEmpty()) {
            return GENERIC_MESSAGE;
        }

        User user = optionalUser.get();

        // Only local accounts can reset their password.
        if (user.getPassword() == null) {
            return GENERIC_MESSAGE;
        }

        // Invalidate any previous reset links for this user.
        tokenRepository.deleteByUser_Id(user.getId());

        // Generate a secure random token.
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        // Store only the SHA-256 hash.
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .tokenHash(tokenHash)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        String resetLink = frontendUrl
                + "/reset-password?token=" + rawToken;

        try {
            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    resetLink
            );
        } catch (Exception exception) {
            exception.printStackTrace();

            throw new RuntimeException(
                    "Unable to send password reset email. Please try again.",
                    exception
            );
        }

        return GENERIC_MESSAGE;
    }

    @Transactional
    public String resetPassword(String rawToken, String newPassword) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new RuntimeException("Invalid or expired reset link");
        }

        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = tokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(() ->
                        new RuntimeException("Invalid or expired reset link")
                );

        if (resetToken.isUsed()
                || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Invalid or expired reset link");
        }

        User user = resetToken.getUser();

        if (user.getPassword() == null) {
            throw new RuntimeException(
                    "This account cannot reset its password"
            );
        }

        // Encode the new password using your existing BCrypt encoder.
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        // Mark the token as used.
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Remove all reset tokens belonging to this user.
        tokenRepository.deleteByUser_Id(user.getId());

        return "Password reset successfully. Please login with your new password.";
    }

    private String hashToken(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return java.util.HexFormat.of().formatHex(hash);

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to process reset token",
                    exception
            );
        }
    }
}