package com.LinkVerse.identity.entity;

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
@Table(name = "Storys")
@Entity
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, columnDefinition = "TEXT")
    String content;

    @Column(nullable = false)
    LocalDateTime postedAt;

    // Thời gian hết hạn (24 giờ sau khi đăng)
    @Column(nullable = false)
    LocalDateTime expiryTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false, columnDefinition = "VARCHAR(10) DEFAULT 'PUBLIC'")
    StoryVisibility visibility = StoryVisibility.PUBLIC;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;
}
