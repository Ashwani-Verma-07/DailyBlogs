package com.tasktracker.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(
            Authentication authentication) {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "JWT authentication successful"
        );

        response.put(
                "email",
                authentication.getName()
        );

        response.put(
                "authenticated",
                authentication.isAuthenticated()
        );

        return response;
    }
}
