package com.LinkVerse.post.service;

import com.LinkVerse.event.dto.NotificationEvent;
import com.LinkVerse.post.Mapper.CommentMapper;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.PostRepository;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostMapper postMapper;
    KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    S3Service s3Service;

    public ApiResponse<PostResponse> createPostWithFiles(PostRequest request, List<MultipartFile> files) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<String> fileUrls = s3Service.uploadFiles(files);

        Post post = Post.builder()
                .content(request.getContent())
                .userId(authentication.getName())
                .fileUrls(fileUrls)
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .comments(List.of())
                .build();

        post = postRepository.save(post);

        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("POSTFIELS")
                .recipient(authentication.getName())
                .subject("Post Success")
                .body("Your post was created successfully" )
                .build();

        kafkaTemplate.send("notification-delivery", notificationEvent);

        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post created successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }

    public ApiResponse<PostResponse> createPost(PostRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();  //get token lay userID

        Post post = Post.builder()
                .content(request.getContent())
                .userId(authentication.getName())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .comments(List.of())
                .build();

        post = postRepository.save(post);
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post created successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }

    public ApiResponse<PostResponse> sharePost(String postId, String content) {
        Post originalPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Post sharedPost = Post.builder()
                .content(content)
                .userId(authentication.getName())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .comments(List.of())
                .sharedPost(originalPost)
                .build();

        sharedPost = postRepository.save(sharedPost);

        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post shared successfully")
                .result(postMapper.toPostResponse(sharedPost))
                .build();
    }




    public ApiResponse<Void> deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postRepository.delete(post);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Post deleted successfully")
                .build();
    }
    //public PageResponse<PostResponse> getMyPosts(int page, int size) -> Controller sẽ đơn giản hơn
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByUserId(userID, pageable);

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(200)
                .message("My posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(pageData.getContent().stream().map(postMapper::toPostResponse).toList())
                        .build())
                .build();
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error converting multipartFile to file", e);
        }
        return convertedFile;
    }
}