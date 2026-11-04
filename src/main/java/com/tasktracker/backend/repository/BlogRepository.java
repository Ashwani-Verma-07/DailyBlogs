package com.tasktracker.backend.repository;

import com.tasktracker.backend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tasktracker.backend.entity.User;
import com.tasktracker.backend.entity.BlogStatus;
import java.util.List;
import java.util.Optional;
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findAllByUserOrderByCreatedAtDesc(
            User user
    );

    Optional<Blog> findByIdAndUser(
            Long id,
            User user
    );

    long countByUser(User user);

    long countByUserAndStatus(User user, BlogStatus status);

    List<Blog> findTop5ByUserOrderByCreatedAtDesc(User user);

    List<Blog> findTop5ByUserAndStatusOrderByUpdatedAtDesc(
            User user,
            BlogStatus status
    );
}
