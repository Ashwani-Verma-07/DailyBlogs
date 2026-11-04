package com.tasktracker.backend.dto;
import com.tasktracker.backend.entity.BlogStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogRequest {
    @NotBlank(message = "Blog title is required")
    @Size(
            max = 200,
            message = "Title cannot exceed 200 characters"
    )
    private String title;


    @NotBlank(message = "Blog content is required")
    private String content;


    @Size(
            max = 100,
            message = "Category cannot exceed 100 characters"
    )
    private String category;


    @Size(
            max = 500,
            message = "Cover image URL cannot exceed 500 characters"
    )
    private String coverImage;


    private BlogStatus status;
}
