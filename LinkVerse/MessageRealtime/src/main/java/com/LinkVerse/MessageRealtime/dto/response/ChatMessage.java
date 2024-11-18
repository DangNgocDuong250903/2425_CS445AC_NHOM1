package com.LinkVerse.MessageRealtime.dto.response;

import com.LinkVerse.MessageRealtime.entity.MessageStatus;
import com.LinkVerse.MessageRealtime.entity.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String sender;
    private String recipient; // Null nếu là nhóm
    private String groupId;   // Null nếu là cá nhân
    private String content;
    MessageStatus status;
    private MessageType type;
}
