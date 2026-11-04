package com.tasktracker.backend.service;

import com.tasktracker.backend.dto.LoginRequest;
import com.tasktracker.backend.entity.AuthProvider;
import com.tasktracker.backend.dto.AuthResponse;
import com.tasktracker.backend.dto.RegisterRequest;
import com.tasktracker.backend.entity.Role;
import com.tasktracker.backend.entity.User;
import com.tasktracker.backend.repository.UserRepository;
import com.tasktracker.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tasktracker.backend.dto.CurrentUserResponse;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        //Register
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check whether email already exists
        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "An account with this email already exists"
            );
        }


        // Create user
        LocalDateTime now = LocalDateTime.now();

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .provider(AuthProvider.LOCAL)

                .role(Role.USER)

                .createdAt(now)

                .updatedAt(now)

                .build();


        // Save user
        User savedUser = userRepository.save(user);

        return AuthResponse.builder()

                .message("Registration successful")

                .userId(savedUser.getId())

                .name(savedUser.getName())

                .email(savedUser.getEmail())

                .role(savedUser.getRole().name())

                .build();
    }
    // ==========================================
    // LOGIN
    // ==========================================

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();


        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );


        // Check whether this is a Google account

        if (user.getProvider() == AuthProvider.GOOGLE) {

            throw new RuntimeException(
                    "This account uses Google Login"
            );
        }


        // Verify password

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // Generate JWT

        String token = jwtService.generateToken(

                user.getId(),

                user.getEmail(),

                user.getRole().name()
        );


        return AuthResponse.builder()

                .message("Login successful")

                .userId(user.getId())

                .name(user.getName())

                .email(user.getEmail())

                .role(user.getRole().name())

                .token(token)

                .build();
    }

    // ==========================================
// GET CURRENT LOGGED-IN USER
// ==========================================
    public CurrentUserResponse getCurrentUser(String email) {

        User user = userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );

        return new CurrentUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
