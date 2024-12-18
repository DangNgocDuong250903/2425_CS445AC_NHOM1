package com.LinkVerse.profile.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_profile_id_1", nullable = false)
    @JsonBackReference
    UserProfile userProfile1;

    @ManyToOne
    @JoinColumn(name = "user_profile_id_2", nullable = false)
    @JsonBackReference
    UserProfile userProfile2;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    FriendshipStatus status;

    @Column(name = "blocked_at")
    LocalDateTime blockedAt; // Lưu thời gian block, nếu trạng thái là BLOCKED
}