package com.LinkVerse.profile.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToMany
    @JoinTable(
            name = "friendship_user_profiles",
            joinColumns = @JoinColumn(name = "friendship_id"),
            inverseJoinColumns = @JoinColumn(name = "user_profile_id")
    )
    @JsonBackReference
    Set<UserProfile> userProfiles;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    FriendshipStatus status;

    @Column(name = "blocked_at")
    LocalDateTime blockedAt; // Lưu thời gian block, nếu trạng thái là BLOCKED
}