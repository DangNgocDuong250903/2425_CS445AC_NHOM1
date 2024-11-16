package com.LinkVerse.MessageRealtime.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users_message")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    User sender; // Người gửi

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    User recipient; // Người nhận

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    String content;

    @Column(name = "timestamp", nullable = false, columnDefinition = "TIMESTAMP")
    LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(10)")
    MessageStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, columnDefinition = "VARCHAR(10)")
    MessageType messageType; // Thêm loại tin nhắn
}
