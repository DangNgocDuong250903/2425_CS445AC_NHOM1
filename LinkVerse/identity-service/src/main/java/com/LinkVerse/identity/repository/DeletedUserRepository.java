package com.LinkVerse.identity.repository;

import com.LinkVerse.identity.entity.DeletedUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeletedUserRepository extends JpaRepository<DeletedUser, String> {
}