package com.Linkverse.notification.controller;

import com.Linkverse.event.dto.NottificationEvent;
import com.Linkverse.notification.Service.EmailService;
import com.Linkverse.notification.dto.request.Recipient;
import com.Linkverse.notification.dto.request.SendEmailRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    EmailService emailService;

     @KafkaListener(topics = "Notification-Delivery")
    public void listenNotificationDelivery(NottificationEvent message){
        log.info("Message received: {}", message);
        emailService.sendEmail(SendEmailRequest.builder()
                        .to(Recipient.builder()
                                .email(message.getRecipient()) //mail cua users
                                .build())
                        .htmlContent(message.getSubject())
                        .htmlContent(message.getBody())
                .build());
    }
}
