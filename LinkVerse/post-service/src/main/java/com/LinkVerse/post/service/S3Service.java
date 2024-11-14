
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class S3Service {

    String bucketName = "image-0";

    @Autowired
    AmazonS3 s3Client;

    public List<String> uploadFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return List.of(); // Trả về danh sách rỗng nếu không có file nào
        }

        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            // Bỏ qua các file rỗng
            if (file == null || file.isEmpty()) {
                log.warn("Skipped empty or null file");
                continue;
            }
            File fileObj = convertMultiPartFileToFile(file);
            String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();

            try {
                s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
                fileUrls.add(s3Client.getUrl(bucketName, fileName).toString());
            } catch (SdkClientException e) {
                log.error("Failed to upload file to S3: {}", e.getMessage());
            } finally {
                // Xóa file tạm sau khi upload
                fileObj.delete();
            }
        }
        return fileUrls;
    }


    public String deleteFiles(String fileName) {
        try {
            boolean exists = s3Client.doesObjectExist(bucketName, fileName);
            if (exists) {
                s3Client.deleteObject(bucketName, fileName);
                return fileName + " removed from S3 successfully.";
            } else {
                log.error("File does not exist: {}", fileName);
                return "File does not exist on S3.";
            }
        } catch (SdkClientException e) {
            log.error("Error occurred while deleting file from S3: {}", e.getMessage());
            return "Error occurred while deleting file from S3.";
        }
    }

    public String uploadFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }
        File fileObj = convertMultiPartFileToFile(file);
        String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
            return s3Client.getUrl(bucketName, fileName).toString();
        } finally {
            fileObj.delete();
        }
    }

    public String deleteFile(String fileName) {
        try {
            boolean exists = s3Client.doesObjectExist(bucketName, fileName);
            if (exists) {
                s3Client.deleteObject(bucketName, fileName);
                return fileName + " removed from S3 successfully.";
            } else {
                log.error("File does not exist: {}", fileName);
                return "File does not exist on S3.";
            }
        } catch (SdkClientException e) {
            log.error("Error occurred while deleting file from S3: {}", e.getMessage());
            return "Error occurred while deleting file from S3.";
        }
    }
//    public byte[] downloadFile(String fileName) {
//        S3Object s3Object = s3Client.getObject(bucketName, fileName);
//        S3ObjectInputStream inputStream = s3Object.getObjectContent();
//        try {
//            byte[] content = IOUtils.toByteArray(inputStream);
//            return content;
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        return null;
//    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot convert an empty or null file");
        }

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
