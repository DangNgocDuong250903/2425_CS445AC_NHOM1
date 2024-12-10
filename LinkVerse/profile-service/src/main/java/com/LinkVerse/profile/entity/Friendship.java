package com.LinkVerse.profile.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "friendship")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_profile_id_1", nullable = false)
    UserProfile userProfile1;

    @ManyToOne
    @JoinColumn(name = "user_profile_id_2", nullable = false)
    UserProfile userProfile2;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    FriendshipStatus status;

    @Column(name = "blocked_at")
    LocalDateTime blockedAt; // Thời gian block nếu status là BLOCKED
}
