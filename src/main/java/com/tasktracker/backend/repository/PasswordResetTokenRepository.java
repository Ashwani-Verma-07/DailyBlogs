package com.tasktracker.backend.repository;

import com.tasktracker.backend.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    void deleteByUser_Id(Long userId);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}