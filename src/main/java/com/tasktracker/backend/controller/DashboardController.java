package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.DashboardResponse;
import com.tasktracker.backend.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
            Authentication authentication
    ) {

        DashboardResponse response =
                blogService.getDashboard(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}
