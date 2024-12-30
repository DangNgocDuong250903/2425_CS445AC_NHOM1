package com.LinkVerse.notification.service;

import com.LinkVerse.event.dto.NotificationEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Service
public class KafkaConsumerService {
    private SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "post-unlike-event", groupId = "group_id", containerFactory = "notificationKafkaListenerContainerFactory")
    public void consumePostUnlikeEvent(NotificationEvent notificationEvent) {
        System.out.println("Received Notification Event: " + notificationEvent);

        // Gửi thông báo đến user cụ thể
        messagingTemplate.convertAndSendToUser(
                notificationEvent.getRecipient(),      // User ID (ví dụ UUID của user)
                "/queue/notifications",                // Kênh riêng tư của user
                notificationEvent                      // Dữ liệu thông báo
        );
    }

    @KafkaListener(topics = "post-like-event", groupId = "group_id", containerFactory = "notificationKafkaListenerContainerFactory")
    public void consumePostLikeEvent(NotificationEvent notificationEvent) {
        System.out.println("Received Notification Event: " + notificationEvent);
        // Gửi thông báo đến user cụ thể
        messagingTemplate.convertAndSendToUser(
                notificationEvent.getRecipient(),      // User ID (ví dụ UUID của user)
                "/queue/notifications",                // Kênh riêng tư của user
                notificationEvent                      // Dữ liệu thông báo
        );
    }

    @RestController
    class TestController {
        private final SimpMessagingTemplate messagingTemplate;

        @Autowired
        public TestController(SimpMessagingTemplate messagingTemplate) {
            this.messagingTemplate = messagingTemplate;
        }

        @GetMapping("/test-notification")
        public String sendTestNotification() {
            NotificationEvent notificationEvent = NotificationEvent.builder()
                    .channel("TEST_CHANNEL")
                    .recipient("test-user") // Replace with actual user ID
                    .templateCode("TEST_TEMPLATE")
                    .param(Map.of("key", "value"))
                    .subject("Test Notification")
                    .body("This is a test notification")
                    .build();

            messagingTemplate.convertAndSendToUser(
                    notificationEvent.getRecipient(),
                    "/queue/notifications",
                    notificationEvent
            );

            return "Test notification sent";
        }
    }
}