package com.LinkVerse.MessageRealtime.service;

import com.LinkVerse.MessageRealtime.entity.Message;
import com.LinkVerse.MessageRealtime.entity.User;
import com.LinkVerse.MessageRealtime.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public Message sendMessage(User sender, User recipient, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setStatus(Message.MessageStatus.SENT);
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByUser(User user) {
        return messageRepository.findByRecipient(user);
    }
}