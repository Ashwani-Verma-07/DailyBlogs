package com.tasktracker.backend.service;

import com.tasktracker.backend.dto.BlogRequest;
import com.tasktracker.backend.dto.BlogResponse;
import com.tasktracker.backend.dto.DashboardResponse;
import com.tasktracker.backend.entity.Blog;
import com.tasktracker.backend.entity.BlogStatus;
import com.tasktracker.backend.entity.User;
import com.tasktracker.backend.repository.BlogRepository;
import com.tasktracker.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    private final UserRepository userRepository;


    // ==========================================
    // CREATE BLOG
    // ==========================================

    public BlogResponse createBlog(
            BlogRequest request,
            String email
    ) {

        User user =
                getUserByEmail(email);


        Blog blog = Blog.builder()

                .title(
                        request.getTitle().trim()
                )

                .content(
                        request.getContent()
                )

                .category(
                        request.getCategory()
                )

                .coverImage(
                        request.getCoverImage()
                )

                .status(
                        request.getStatus() != null
                                ? request.getStatus()
                                : BlogStatus.DRAFT
                )

                .user(user)

                .build();


        Blog savedBlog =
                blogRepository.save(blog);


        return mapToResponse(savedBlog);
    }


    // ==========================================
    // GET ALL MY BLOGS
    // ==========================================

    public List<BlogResponse> getMyBlogs(
            String email
    ) {

        User user =
                getUserByEmail(email);


        return blogRepository
                .findAllByUserOrderByCreatedAtDesc(user)

                .stream()

                .map(this::mapToResponse)

                .toList();
    }


    // ==========================================
    // GET SINGLE BLOG
    // ==========================================

    public BlogResponse getBlog(
            Long blogId,
            String email
    ) {

        User user =
                getUserByEmail(email);


        Blog blog =
                blogRepository
                        .findByIdAndUser(
                                blogId,
                                user
                        )

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blog not found"
                                )
                        );


        return mapToResponse(blog);
    }


    // ==========================================
    // UPDATE BLOG
    // ==========================================

    public BlogResponse updateBlog(
            Long blogId,
            BlogRequest request,
            String email
    ) {

        User user =
                getUserByEmail(email);


        Blog blog =
                blogRepository
                        .findByIdAndUser(
                                blogId,
                                user
                        )

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blog not found"
                                )
                        );


        blog.setTitle(
                request.getTitle().trim()
        );

        blog.setContent(
                request.getContent()
        );

        blog.setCategory(
                request.getCategory()
        );

        blog.setCoverImage(
                request.getCoverImage()
        );


        if (request.getStatus() != null) {

            blog.setStatus(
                    request.getStatus()
            );
        }


        Blog updatedBlog =
                blogRepository.save(blog);


        return mapToResponse(updatedBlog);
    }


    // ==========================================
    // DELETE BLOG
    // ==========================================

    public void deleteBlog(
            Long blogId,
            String email
    ) {

        User user =
                getUserByEmail(email);


        Blog blog =
                blogRepository
                        .findByIdAndUser(
                                blogId,
                                user
                        )

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blog not found"
                                )
                        );


        blogRepository.delete(blog);
    }


    // ==========================================
    // GET USER
    // ==========================================

    private User getUserByEmail(
            String email
    ) {

        return userRepository
                .findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private BlogResponse mapToResponse(
            Blog blog
    ) {

        return BlogResponse.builder()

                .id(blog.getId())

                .title(blog.getTitle())

                .content(blog.getContent())

                .category(blog.getCategory())

                .coverImage(blog.getCoverImage())

                .status(blog.getStatus())

                .createdAt(blog.getCreatedAt())

                .updatedAt(blog.getUpdatedAt())

                .build();
    }

    public DashboardResponse getDashboard(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        long totalBlogs = blogRepository.countByUser(user);

        long publishedBlogs =
                blogRepository.countByUserAndStatus(
                        user,
                        BlogStatus.PUBLISHED
                );

        long draftBlogs =
                blogRepository.countByUserAndStatus(
                        user,
                        BlogStatus.DRAFT
                );

        List<BlogResponse> recentBlogs =
                blogRepository
                        .findTop5ByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        List<BlogResponse> draftBlogsList =
                blogRepository
                        .findTop5ByUserAndStatusOrderByUpdatedAtDesc(
                                user,
                                BlogStatus.DRAFT
                        )
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        long totalCategories =
                blogRepository.findAllByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(Blog::getCategory)
                        .filter(category ->
                                category != null &&
                                        !category.trim().isEmpty()
                        )
                        .distinct()
                        .count();

        return DashboardResponse.builder()
                .totalBlogs(totalBlogs)
                .publishedBlogs(publishedBlogs)
                .draftBlogs(draftBlogs)
                .totalCategories(totalCategories)
                .recentBlogs(recentBlogs)
                .draftBlogsList(draftBlogsList)
                .build();
    }
}