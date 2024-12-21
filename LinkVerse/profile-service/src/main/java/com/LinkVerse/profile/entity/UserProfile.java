package com.LinkVerse.profile.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class UserProfile implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String userId;
    String username;
    String email;
    String firstName;
    String lastName;
    Date dateOfBirth;
    String city;
    String phoneNumber;
    Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    UserStatus status = UserStatus.ONLINE;

    @Column(name = "email_verified", nullable = false)
    boolean emailVerified;

    @OneToMany(mappedBy = "userProfile1", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    Set<Friendship> friends;

}