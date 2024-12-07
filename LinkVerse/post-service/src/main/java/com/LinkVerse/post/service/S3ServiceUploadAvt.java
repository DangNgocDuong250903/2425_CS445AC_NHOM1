package com.LinkVerse.post.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class S3ServiceUploadAvt {
    String bucketName = "imgpost-0";

    @Autowired
    AmazonS3 s3Client;

    public String uploadFileToS3(MultipartFile file, String fileName) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty or null file");
        }

        File fileObj = convertMultiPartFileToFile(file);

        try {
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
            return s3Client.getUrl(bucketName, fileName).toString();
        } catch (SdkClientException e) {
            log.error("Failed to upload file to S3: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file to S3", e);
        } finally {
            fileObj.delete();
        }
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error converting multipartFile to file", e);
            throw new RuntimeException("Failed to convert file", e);
        }
        return convertedFile;
    }
}