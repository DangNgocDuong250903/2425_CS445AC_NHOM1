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
import com.LinkVerse.post.entity.PostVisibility;
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
import org.springframework.web.multipart.MultipartFile;


import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

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
                .fileUrls(fileUrls) // lấy cái này để hiện thị trên FE
                .visibility(request.getVisibility())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .comments(List.of())
                .build();

        post = postRepository.save(post);

        // TODO thông báo khi post thành công

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
        List<String> fileUrls = originalPost.getFileUrls();

        Post sharedPost = Post.builder()
                .content(content)
                .userId(authentication.getName())
                .fileUrls(fileUrls) // đang test, xoá nếu bị trùng
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .comments(List.of())
                .sharedPost(originalPost)
                .build();

        // TODO thêm xử lý ngoại lệ nếu bài đã share bị xoá

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

        List<String> fileUrls = post.getFileUrls();

        if (fileUrls != null && !fileUrls.isEmpty()) {
            for (String fileUrl : fileUrls) {
                String decodedUrl = decodeUrl(fileUrl);
                String fileName = extractFileNameFromUrl(decodedUrl);

                if (fileName != null) {
                    String result = s3Service.deleteFile(fileName);
                    log.info(result);
                }
            }
        }
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

        List<Post> filteredPosts = pageData.getContent().stream()
                .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                        (post.getVisibility() == PostVisibility.FRIENDS && isFriend(userID, post.getUserId())) ||
                        post.getVisibility() == PostVisibility.PRIVATE)
                .toList();

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(200)
                .message("My posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(filteredPosts.stream().map(postMapper::toPostResponse).toList())
                        .build())
                .build();
    }

    boolean isFriend(String currentUserId, String postUserId) {
        // TODO nối qua friend-service để check relationship
        return true;
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