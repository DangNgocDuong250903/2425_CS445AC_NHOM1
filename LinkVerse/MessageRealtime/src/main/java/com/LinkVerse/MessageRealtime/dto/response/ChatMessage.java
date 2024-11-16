package com.LinkVerse.MessageRealtime.dto.response;

import com.LinkVerse.MessageRealtime.entity.MessageStatus;
import com.LinkVerse.MessageRealtime.entity.MessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessage {
    String content;
    String sender;
    MessageStatus status;
    MessageType type;
}
