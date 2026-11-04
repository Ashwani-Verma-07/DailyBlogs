package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.BlogRequest;
import com.tasktracker.backend.dto.BlogResponse;
import com.tasktracker.backend.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BlogController {
    private final BlogService blogService;

    // Create Blog
    @PostMapping
    public ResponseEntity<BlogResponse> createBlog(

            @Valid
            @RequestBody
            BlogRequest request,

            Authentication authentication
    ) {

        BlogResponse response =
                blogService.createBlog(
                        request,
                        authentication.getName()
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET MY BLOGS

    @GetMapping
    public ResponseEntity<List<BlogResponse>> getMyBlogs(

            Authentication authentication
    ) {

        return ResponseEntity.ok(
                blogService.getMyBlogs(
                        authentication.getName()
                )
        );
    }

    // GET BLOG BY ID
    @GetMapping("/{id}")
    public ResponseEntity<BlogResponse> getBlog(

            @PathVariable Long id,

            Authentication authentication
    ) {

        return ResponseEntity.ok(
                blogService.getBlog(
                        id,
                        authentication.getName()
                )
        );
    }

    // UPDATE BLOG
    @PutMapping("/{id}")
    public ResponseEntity<BlogResponse> updateBlog(

            @PathVariable Long id,

            @Valid
            @RequestBody
            BlogRequest request,

            Authentication authentication
    ) {

        return ResponseEntity.ok(
                blogService.updateBlog(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }
// DELETE
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteBlog(

        @PathVariable Long id,

        Authentication authentication
) {

    blogService.deleteBlog(
            id,
            authentication.getName()
    );


    return ResponseEntity
            .noContent()
            .build();
}
}
