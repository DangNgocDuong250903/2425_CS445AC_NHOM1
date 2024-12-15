package com.LinkVerse.notification.service;

import com.LinkVerse.notification.dto.request.EmailRequest;
import com.LinkVerse.notification.dto.request.SendEmailRequest;
import com.LinkVerse.notification.dto.request.Sender;
import com.LinkVerse.notification.dto.response.EmailResponse;
import com.LinkVerse.notification.exception.AppException;
import com.LinkVerse.notification.exception.ErrorCode;
import com.LinkVerse.notification.repository.UserRepository;
import com.LinkVerse.notification.repository.httpclient.EmailClient;
import feign.FeignException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailService {
    EmailClient emailClient;
    final JavaMailSender javaMailSender;
    UserRepository userRepository;
    @Value("${notification.email.brevo-apikey}")
    @NonFinal
    String apiKey;

    public EmailResponse sendEmail(SendEmailRequest request) {
        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .name("NgocDuong")
                        .email("ngocduong2592003@gmail.com")
                        .build())
                .to(List.of(request.getTo()))
                .subject(request.getSubject())
                .htmlContent(request.getHtmlContent())
                .build();

        try {
            // Gửi email qua dịch vụ Brevo
            return emailClient.sendEmail(apiKey, emailRequest);
        } catch (FeignException e) {
            // Nếu có lỗi, gọi phương thức fallback
            return sendEmailFallback(request);
        }
    }

    private EmailResponse sendEmailFallback(SendEmailRequest request) {
        try {
            // Tạo một đối tượng MimeMessage
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Thiết lập thông tin email
            helper.setTo(request.getTo().getEmail());
            helper.setSubject(request.getSubject());
            helper.setText(request.getHtmlContent(), true);

            // Gửi email
            javaMailSender.send(message);

            // Trả về phản hồi thành công
            return new EmailResponse("Email sent successfully via fallback method");
        } catch (MessagingException e) {
            // Xử lý ngoại lệ nếu gửi email qua JavaMailSender thất bại
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    public void sendEmailForgetPass(String email, String token) {
        if (!userRepository.existsByEmail(email)) {
            log.error("Email {} does not exist in the system", email);
            throw new RuntimeException("Email does not exist in the system");
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            String resetLink = "http://localhost:8082/notification/email/reset-password?token=" + token;
            String htmlContent = "<p>Click vao de thay doi mat khau:</p>" +
                    "<a href=\"" + resetLink + "\">Reset Password</a>";

            helper.setTo(email);
            helper.setSubject("Password Reset");
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            log.info("Email sent successfully to {}", email);
        } catch (MailException | MessagingException e) {
            log.error("Failed to send email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Cannot send email", e);
        }
    }
}
