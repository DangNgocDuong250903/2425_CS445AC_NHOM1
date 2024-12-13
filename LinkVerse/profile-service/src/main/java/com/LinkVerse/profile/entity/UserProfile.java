package com.LinkVerse.profile.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String userId;
    String imageUrl;
    String username;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    UserStatus status = UserStatus.ONLINE;

    @Column(name = "email_verified", nullable = false)
    boolean emailVerified;

    @OneToMany(mappedBy = "userProfile1", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    Set<Friendship> friends;

    @ElementCollection
    Set<String> followers = new HashSet<>();

    @ElementCollection
    Set<String> followings = new HashSet<>();
}