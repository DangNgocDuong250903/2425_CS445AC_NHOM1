package com.LinkVerse.post.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UploadAvatarUserService {

    @Autowired
    S3ServiceUploadAvt s3ServiceUploadAvt;

    public String uploadAvatar(MultipartFile file, String userId) {
        String fileName = userId + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        return s3ServiceUploadAvt.uploadFileToS3(file, fileName);
    }
}