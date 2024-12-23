package com.LinkVerse.notification.service;

import com.LinkVerse.notification.dto.ApiResponse;
import com.LinkVerse.notification.dto.request.EmailRequest;
import com.LinkVerse.notification.dto.request.SendEmailRequest;
import com.LinkVerse.notification.dto.request.Sender;
import com.LinkVerse.notification.dto.response.EmailResponse;
import com.LinkVerse.notification.entity.User;
import com.LinkVerse.notification.exception.AppException;
import com.LinkVerse.notification.exception.ErrorCode;
import com.LinkVerse.notification.repository.UserRepository;
import com.LinkVerse.notification.repository.httpclient.EmailClient;
import com.nimbusds.jwt.SignedJWT;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailService {
    final EmailClient emailClient;
    final JavaMailSender javaMailSender;
    final UserRepository userRepository;
    final TokenService tokenService;

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
            return emailClient.sendEmail(apiKey, emailRequest);
        } catch (FeignException e) {
            return sendEmailFallback(request);
        }
    }

    private EmailResponse sendEmailFallback(SendEmailRequest request) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(request.getTo().getEmail());
            helper.setSubject(request.getSubject());
            helper.setText(request.getHtmlContent(), true);
            javaMailSender.send(message);
            return new EmailResponse("Email sent successfully via fallback method");
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    public void sendEmailForgetPass(String email, User user) {
        if (!userRepository.existsByEmail(email)) {
            log.error("Email {} does not exist in the system", email);
            throw new RuntimeException("Email does not exist in the system");
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String resetLink = "http://localhost:5173/reset-password?token=" + tokenService.generateToken(user);
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

    public ApiResponse<Void> verifyEmail(String token) {
        try {
            SignedJWT signedJWT = tokenService.verifyToken(token, false);
            String userId = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            user.setEmailVerified(true);
            userRepository.save(user);
            tokenService.invalidateToken(signedJWT.getJWTClaimsSet().getJWTID());
            return ApiResponse.<Void>builder()
                    .code(1000)
                    .message("Email verified successfully")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .code(500)
                    .message("Failed to verify email: " + e.getMessage())
                    .build();
        }
    }

    public void sendEmailVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        String token = tokenService.generateToken(user);

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String verificationLink = "http://localhost:5173/verify-email?token=" + token;
            String htmlContent = "<p>Click the link to verify your email:</p>" +
                    "<a href=\"" + verificationLink + "\">Verify Email</a>";
            helper.setTo(email);
            helper.setSubject("Email Verification");
            helper.setText(htmlContent, true);
            javaMailSender.send(message);
            log.info("Verification email sent successfully to {}", email);
        } catch (MailException | MessagingException e) {
            log.error("Failed to send verification email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Cannot send email", e);
        }
    }

    public void resetPassword(String token, String newPassword) {
        try {
            SignedJWT signedJWT = tokenService.verifyToken(token, false);
            String userId = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            tokenService.invalidateToken(signedJWT.getJWTClaimsSet().getJWTID());
        } catch (Exception e) {
            throw new RuntimeException("Failed to reset password: " + e.getMessage(), e);
        }
    }
}