package com.tasktracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class DashboardResponse {
    private long totalBlogs;

    private long publishedBlogs;

    private long draftBlogs;

    private long totalCategories;

    private List<BlogResponse> recentBlogs;

    private List<BlogResponse> draftBlogsList;
}
