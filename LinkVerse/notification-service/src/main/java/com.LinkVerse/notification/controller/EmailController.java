package com.LinkVerse.notification.controller;

import com.LinkVerse.notification.dto.ApiResponse;
import com.LinkVerse.notification.dto.request.SendEmailRequest;
import com.LinkVerse.notification.dto.response.EmailResponse;
import com.LinkVerse.notification.entity.User;
import com.LinkVerse.notification.exception.AppException;
import com.LinkVerse.notification.exception.ErrorCode;
import com.LinkVerse.notification.repository.UserRepository;
import com.LinkVerse.notification.service.AuthenticationService;
import com.LinkVerse.notification.service.EmailService;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/email")
@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailController {
    EmailService emailService;
    UserRepository userRepository;
    AuthenticationService authenticationService;

    @PostMapping("/send")
    ApiResponse<EmailResponse> sendEmail(@RequestBody SendEmailRequest request) {
        return ApiResponse.<EmailResponse>builder()
                .result(emailService.sendEmail(request))
                .build();
    }

    @PostMapping("/send-forget-pass")
    ApiResponse<Void> sendEmailForgetPass(@RequestParam String email) {
        try {
            // Lấy người dùng từ email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            // Tạo token reset mật khẩu
            String token = authenticationService.generatePasswordResetToken(user);

            // Gửi email với token
            emailService.sendEmailForgetPass(email, token);

            return ApiResponse.<Void>builder()
                    .code(1000)
                    .message("Email sent successfully")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .code(500)
                    .message("Failed to send email: " + e.getMessage())
                    .build();
        }
    }


    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            // Xác thực token
            SignedJWT signedJWT = authenticationService.verifyToken(token, false);
            String userId = signedJWT.getJWTClaimsSet().getSubject(); // Lấy ID người dùng từ token

            // Lấy người dùng từ cơ sở dữ liệu
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            // Cập nhật mật khẩu mới và lưu vào cơ sở dữ liệu
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);


            authenticationService.invalidateToken(signedJWT.getJWTClaimsSet().getJWTID());
            return ApiResponse.<Void>builder()
                    .code(1000)
                    .message("Password reset successfully")
                    .build();
        } catch (Exception e) {
            // Xử lý ngoại lệ và trả về phản hồi lỗi
            return ApiResponse.<Void>builder()
                    .code(500)
                    .message("Failed to reset password: " + e.getMessage())
                    .build();
        }
    }

    @PostMapping("/send-verification")
    public ApiResponse<Void> sendEmailVerification(@RequestParam String email) {
        emailService.sendEmailVerification(email);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Verification email sent successfully")
                .build();
    }

    @GetMapping("/verify")
    public ApiResponse<Void> verifyEmail(@RequestParam String token) {
        return emailService.verifyEmail(token);
    }

}
