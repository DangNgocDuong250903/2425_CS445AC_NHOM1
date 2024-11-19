package com.LinkVerse.MessageRealtime.dto.response;

import com.LinkVerse.MessageRealtime.entity.MessageStatus;
import com.LinkVerse.MessageRealtime.entity.MessageType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChatMessage {
    private String sender;
    private String recipientId;
    private String groupId;
    private String content;
    private MessageStatus status;
    private MessageType type;
}