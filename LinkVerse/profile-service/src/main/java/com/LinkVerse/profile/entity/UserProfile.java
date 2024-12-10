package com.LinkVerse.profile.entity;

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
@Table(name = "user_profile")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "user_id", nullable = false, unique = true)
    String userId;

    @Column(name = "image_url")
    String imageUrl;

    @Column(name = "username", nullable = false, unique = true)
    String username;

    @Column(name = "status")
    String status;

    @Column(name = "email", nullable = false, unique = true)
    String email;

    @Column(name = "first_name")
    String firstName;

    @Column(name = "last_name")
    String lastName;

    @Column(name = "dob")
    LocalDate dob;

    @Column(name = "city")
    String city;

    @OneToMany(mappedBy = "userProfile1", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Friendship> friends;

    @ElementCollection
    Set<String> followers = new HashSet<>();

    @ElementCollection
    Set<String> followings = new HashSet<>();
}
