package com.tasktracker.backend.dto;

import com.tasktracker.backend.entity.BlogStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Builder

public class BlogResponse {
    private Long id;

    private String title;

    private String content;

    private String category;

    private String coverImage;

    private BlogStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
