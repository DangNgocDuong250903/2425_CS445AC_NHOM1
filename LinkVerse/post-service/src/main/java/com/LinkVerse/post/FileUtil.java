package com.LinkVerse.post;

import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

public class FileUtil {

    private static final List<String> IMAGE_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp"
    );

    public static boolean isImageFile(MultipartFile file) {
        return IMAGE_CONTENT_TYPES.contains(file.getContentType());
    }
}