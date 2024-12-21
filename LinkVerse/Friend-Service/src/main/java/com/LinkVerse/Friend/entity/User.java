package com.LinkVerse.Friend.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String userId;

    String username;
    String password;

    @Enumerated(EnumType.STRING)
    UserStatus status = UserStatus.ONLINE;

    @ManyToMany
    Set<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Friend> friends;

    @ElementCollection
    Set<String> followers = new HashSet<>();

    @ElementCollection
    Set<String> followings = new HashSet<>();
}
