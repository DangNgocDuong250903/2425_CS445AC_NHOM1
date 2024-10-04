package com.LinkVerse.profile.repository;

import org.springframework.web.multipart.MultipartFile;


public interface UploadImage {
    String uploadImageFile(MultipartFile uploadFile);
}
