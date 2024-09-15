package com.Linkverse.profile.controller;

import com.Linkverse.profile.Service.EmailService;
import com.Linkverse.profile.dto.ApiResponse;
import com.Linkverse.profile.dto.request.SendEmailRequest;
import com.Linkverse.profile.dto.response.EmailResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailController {
    EmailService emailService;

    @PostMapping("/email/send")
    ApiResponse <EmailResponse> sendEmail(@RequestBody SendEmailRequest request) {
        return ApiResponse.<EmailResponse>builder()
                .result(emailService.sendEmail(request))
                .build();

    }
}
