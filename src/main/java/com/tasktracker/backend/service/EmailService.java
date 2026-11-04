package com.tasktracker.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendPasswordResetEmail(String recipient, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(recipient);
        message.setSubject("TaskTracker - Reset Your Password");

        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset your TaskTracker password.\n\n" +
                        "Click the link below to reset your password:\n\n" +
                        resetLink + "\n\n" +
                        "This link expires in 15 minutes and can only be used once.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Regards,\nTaskTracker Team"
        );

        mailSender.send(message);
    }
}