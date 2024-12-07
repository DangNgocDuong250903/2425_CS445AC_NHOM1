package com.LinkVerse.post.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class S3ServiceStory {

    @Value("${aws.s3.bucket-name}")
    String bucketName = "imgpost-0";

    AmazonS3 s3Client;
    RekognitionService rekognitionService;

    public S3Object getObject(String fileName) {
        try {
            return s3Client.getObject(bucketName, fileName);
        } catch (SdkClientException e) {
            log.error("Failed to retrieve object from S3: {}", e.getMessage());
            throw new RuntimeException("Error retrieving file from S3", e);
        }
    }

    public List<String> uploadFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                log.warn("Skipped empty or null file");
                continue;
            }

            try {
                MultipartFile resizedFile = resizeImage(file, 1080, 1920);
                File fileObj = convertMultiPartFileToFile(resizedFile);
                String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();

                s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
                log.info("Uploaded file to S3: {}", fileName);

                S3Object s3Object = s3Client.getObject(bucketName, fileName);
                if (!rekognitionService.isImageSafe(s3Object)) {
                    s3Client.deleteObject(bucketName, fileName);
                    log.warn("Deleted unsafe image: {}", fileName);
                    continue;
                }

                fileUrls.add(s3Client.getUrl(bucketName, fileName).toString());
            } catch (SdkClientException e) {
                log.error("AWS S3 Exception: {}", e.getMessage());
            }
        }
        return fileUrls;
    }

    private MultipartFile resizeImage(MultipartFile originalFile, int width, int height) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Thumbnails.of(originalFile.getInputStream())
                    .size(width, height)
                    .outputFormat("jpg")
                    .toOutputStream(outputStream);

            return new MultipartFile() {
                @Override
                public String getName() {
                    return originalFile.getName();
                }

                @Override
                public String getOriginalFilename() {
                    return originalFile.getOriginalFilename();
                }

                @Override
                public String getContentType() {
                    return "image/jpeg";
                }

                @Override
                public boolean isEmpty() {
                    return outputStream.size() == 0;
                }

                @Override
                public long getSize() {
                    return outputStream.size();
                }

                @Override
                public byte[] getBytes() {
                    return outputStream.toByteArray();
                }

                @Override
                public InputStream getInputStream() {
                    return new ByteArrayInputStream(outputStream.toByteArray());
                }

                @Override
                public void transferTo(File dest) throws IOException {
                    try (FileOutputStream fos = new FileOutputStream(dest)) {
                        fos.write(outputStream.toByteArray());
                    }
                }
            };
        } catch (IOException e) {
            log.error("Error resizing image: ", e);
            throw new RuntimeException("Failed to resize image.", e);
        }
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot convert an empty or null file");
        }

        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error converting MultipartFile to File", e);
            throw new RuntimeException("Failed to convert file", e);
        }
        return convertedFile;
    }

    public byte[] downloadFile(String fileName) {
        try {
            S3Object s3Object = s3Client.getObject(bucketName, fileName);
            return IOUtils.toByteArray(s3Object.getObjectContent());
        } catch (IOException e) {
            log.error("Error occurred while downloading file from S3: {}", e.getMessage());
            throw new RuntimeException("Failed to download file from S3", e);
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
}