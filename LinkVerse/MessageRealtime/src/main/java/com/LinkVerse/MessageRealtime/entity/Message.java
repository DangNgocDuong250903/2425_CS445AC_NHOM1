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
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = true) // Null nếu là group message
    User recipient;
    @Column(name = "group_id", nullable = true)
    String groupId; // Lưu ID nhóm nếu là tin nhắn nhóm

    @Column(nullable = false, columnDefinition = "TEXT")
    String content;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(10)")
    MessageStatus status;
    @Column(nullable = false)
    LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, columnDefinition = "VARCHAR(10)")
    MessageType messageType; // Thêm loại tin nhắn

}
