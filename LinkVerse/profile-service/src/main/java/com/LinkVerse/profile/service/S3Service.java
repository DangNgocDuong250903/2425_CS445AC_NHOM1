package com.LinkVerse.profile.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
public class S3Service {

    String bucketName = "imgpost-0";

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

//    public List<String> uploadFiles(List<MultipartFile> files) {
//        if (files == null || files.isEmpty()) {
//            return List.of(); // Trả về danh sách rỗng nếu không có file nào
//        }
//
//        List<String> fileUrls = new ArrayList<>();
//        for (MultipartFile file : files) {
//            // Bỏ qua các file rỗng
//            if (file == null || file.isEmpty()) {
//                log.warn("Skipped empty or null file");
//                continue;
//            }
//            File fileObj = convertMultiPartFileToFile(file);
//            String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
//
//            try {
//                s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
//                S3Object s3Object = s3Client.getObject(bucketName, fileName);
//
//                if (!rekognitionService.isImageSafe(s3Object)) {
//                    s3Client.deleteObject(bucketName, fileName);
//                    log.warn("Deleted unsafe image: {}", fileName);
//                    continue;
//                }
//
//                fileUrls.add(s3Client.getUrl(bucketName, fileName).toString());
//            } catch (SdkClientException e) {
//                log.error("Failed to upload file to S3: {}", e.getMessage());
//            } finally {
//                // Xóa file tạm sau khi upload
//                fileObj.delete();
//            }
//        }
//        return fileUrls;
//    }

//    public String uploadFile(MultipartFile file) {
//        String contentType = file.getContentType();
//        if (contentType == null || !contentType.startsWith("image/")) {
//            throw new IllegalArgumentException("Only image files are allowed.");
//        }
//        File fileObj = convertMultiPartFileToFile(file);
//        String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
//
//        try {
//            s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
//            S3Object s3Object = s3Client.getObject(bucketName, fileName);
//
//            if (!rekognitionService.isImageSafe(s3Object)) {
//                s3Client.deleteObject(bucketName, fileName);
//                log.warn("Deleted unsafe image: {}", fileName);
//                throw new IllegalArgumentException("Uploaded image contains unsafe content.");
//            }
//
//            return s3Client.getUrl(bucketName, fileName).toString();
//        } finally {
//            fileObj.delete();
//        }
//    }

    private MultipartFile resizeImage(MultipartFile originalFile, int width, int height) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Thumbnails.of(originalFile.getInputStream())
                    .size(width, height)
                    .outputFormat("jpg") // Đảm bảo định dạng ảnh (nếu cần)
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
                public byte[] getBytes() throws IOException {
                    return outputStream.toByteArray();
                }

                @Override
                public InputStream getInputStream() {
                    return new ByteArrayInputStream(outputStream.toByteArray());
                }

                @Override
                public void transferTo(File dest) throws IOException, IllegalStateException {
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

    public byte[] downloadFile(String fileName) {
        try {
            S3Object s3Object = s3Client.getObject(bucketName, fileName); // Lấy object từ S3
            S3ObjectInputStream inputStream = s3Object.getObjectContent(); // Lấy stream dữ liệu
            return IOUtils.toByteArray(inputStream); // Chuyển thành mảng byte
        } catch (IOException e) {
            log.error("Error occurred while downloading file from S3: {}", e.getMessage());
            throw new RuntimeException("Failed to download file from S3", e);
        }
    }

    public S3Object getObject(String fileName) {
        return s3Client.getObject(new GetObjectRequest(bucketName, fileName));
    }
}