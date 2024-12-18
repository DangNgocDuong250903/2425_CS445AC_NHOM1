package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.CommentMapper;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.CommentRepository;
import com.LinkVerse.post.repository.PostRepository;
import com.amazonaws.services.s3.model.S3Object;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    PostRepository postRepository;
    CommentRepository commentRepository;
    PostMapper postMapper;
    CommentMapper commentMapper;
    S3Service s3Service;
    RekognitionService rekognitionService;

    public ApiResponse<PostResponse> addComment(String postId, CommentRequest commentRequest, List<MultipartFile> imageFiles) {
        // Validate the comment content
        if (commentRequest == null || commentRequest.getContent() == null || commentRequest.getContent().trim().isEmpty()) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Comment content cannot be empty.")
                    .build();
        }

        // Find the post by its ID
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        List<String> safeFileUrls = new ArrayList<>();

        // Upload files if provided and validate their content
        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (MultipartFile file : imageFiles) {
                if (file != null && !file.isEmpty()) {
                    try {
                        // Step 1: Upload file to S3
                        String fileUrl = s3Service.uploadFile(file);

                        // Step 2: Validate the uploaded image for safety
                        String fileName = extractFileNameFromUrl(decodeUrl(fileUrl));
                        S3Object s3Object = s3Service.getObject(fileName);

                        if (rekognitionService.isImageSafe(s3Object)) {
                            // Step 3: Add only safe image URLs
                            safeFileUrls.add(fileUrl);
                            log.info("Safe image added to comment: {}", fileUrl);
                        } else {
                            // Step 4: Remove unsafe images from storage
                            log.warn("Unsafe content detected in file: {}", fileName);
                            s3Service.deleteFile(fileName);
                        }
                    } catch (Exception e) {
                        log.error("Error during file upload or validation: {}", e.getMessage(), e);
                    }
                }
            }
        }

        // Build the new comment
        Comment newComment = Comment.builder()
                .content(commentRequest.getContent())
                .userId(currentUserId)
                .imageUrl(safeFileUrls) // Attach only safe image URLs
                .like(0)
                .unlike(0)
                .likeCount(0)
                .createdDate(Instant.now())
                .commentId(UUID.randomUUID().toString())
                .id(UUID.randomUUID().toString())
                .build();

        // Save the comment to the CommentRepository
        commentRepository.save(newComment);

        // Add the commentId to the post
        post.getComments().add(newComment);
        post.setCommentCount(post.getComments().size());
        postRepository.save(post);

        // Map the updated post to the response
        PostResponse postResponse = postMapper.toPostResponse(post);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Comment added successfully.")
                .result(postResponse)
                .build();
    }

    private String extractFileNameFromUrl(String fileUrl) {
        // Ví dụ URL: https://image-0.s3.ap-southeast-2.amazonaws.com/1731100957786_2553d883.jpg
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        return fileName;
    }

    private String decodeUrl(String encodedUrl) {
        return URLDecoder.decode(encodedUrl, StandardCharsets.UTF_8);
    }
}