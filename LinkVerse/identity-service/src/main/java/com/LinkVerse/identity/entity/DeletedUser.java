package com.LinkVerse.identity.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "deleted_users")
@Data
public class DeletedUser {
    @Id
    private String id;
    private String username;
    private LocalDateTime deletedAt;
}