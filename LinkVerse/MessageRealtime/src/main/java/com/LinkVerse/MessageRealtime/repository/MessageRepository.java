package com.LinkVerse.MessageRealtime.repository;

import com.LinkVerse.MessageRealtime.entity.Message;
import com.LinkVerse.MessageRealtime.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySender(User sender);

    List<Message> findByRecipient(User recipient);
}