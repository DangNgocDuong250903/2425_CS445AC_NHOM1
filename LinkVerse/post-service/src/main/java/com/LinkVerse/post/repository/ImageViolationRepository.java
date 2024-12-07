package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.ImageViolation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageViolationRepository extends JpaRepository<ImageViolation, Long> {
}