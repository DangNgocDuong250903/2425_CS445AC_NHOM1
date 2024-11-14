package com.LinkVerse.post.service;

<<<<<<< HEAD
import com.LinkVerse.post.FileUtil;
=======
import com.LinkVerse.event.dto.NotificationEvent;
import com.LinkVerse.post.Mapper.CommentMapper;
>>>>>>> origin/main
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.Mapper.ShareMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostVisibility;
<<<<<<< HEAD
import com.LinkVerse.post.repository.PostRepository;
import com.LinkVerse.post.repository.client.ProfileServiceClient;
import feign.FeignException;
=======
import com.LinkVerse.post.entity.SharedPost;
import com.LinkVerse.post.repository.PostRepository;
import com.LinkVerse.post.repository.SharedPostRepository;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
>>>>>>> origin/main
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
<<<<<<< HEAD
=======
import org.springframework.security.access.prepost.PreAuthorize;
>>>>>>> origin/main
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

<<<<<<< HEAD
=======

>>>>>>> origin/main
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
<<<<<<< HEAD
=======
import java.util.stream.Collectors;

>>>>>>> origin/main

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostMapper postMapper;
<<<<<<< HEAD
    KafkaTemplate<String, Object> kafkaTemplate;
    ProfileServiceClient profileServiceClient;

    @Autowired
    S3Service s3Service;
=======
    SharedPostRepository sharedPostRepository;
    ShareMapper shareMapper;

    KafkaTemplate<String, Object> kafkaTemplate;
    @Autowired
    S3Service s3Service;


    public ApiResponse<PostResponse> createPostWithFiles(PostRequest request, List<MultipartFile> files) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra kỹ nếu files không null và chỉ chứa file không rỗng
        List<String> fileUrls = (files != null && files.stream().anyMatch(file -> !file.isEmpty()))
                ? s3Service.uploadFiles(files.stream().filter(file -> !file.isEmpty()).collect(Collectors.toList()))
                : List.of();
>>>>>>> origin/main

    public ApiResponse<PostResponse> postImageAvatar(PostRequest request, MultipartFile avatarFile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra nếu file là hình ảnh
        if (!FileUtil.isImageFile(avatarFile)) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Only image files are allowed.")
                    .build();
        }

        // Upload file lên S3 và lấy avatar URL
        String avatarUrl = s3Service.uploadFile(avatarFile);

        // Tạo đối tượng Post mới
        Post post = Post.builder()
                .content(request.getContent())
                .userId(authentication.getName())
<<<<<<< HEAD
                .fileUrl(avatarUrl)
=======
                .fileUrls(fileUrls) // lấy cái này để hiển thị trên FE
>>>>>>> origin/main
                .visibility(request.getVisibility())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .comments(List.of())
                .build();

        post = postRepository.save(post);

<<<<<<< HEAD
        // Cập nhật avatar của người dùng
        try {
            profileServiceClient.updateImage(authentication.getName(), avatarUrl);
        } catch (FeignException e) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to update avatar in profile-service: " + e.getMessage())
                    .build();
        }

        // Trả về thông tin post mới cùng với response
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Avatar post created successfully and profile updated")
                .result(postMapper.toPostResponse(post))
                .build();
    }

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

=======
>>>>>>> origin/main
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post created successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }


<<<<<<< HEAD
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
=======
    public ApiResponse<Void> deletePost(String postId) {
        // Lấy bài viết từ cơ sở dữ liệu
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        // kt quyền xóa bài viết
        if (!post.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        List<String> fileUrls = post.getFileUrls();
        if (fileUrls != null && !fileUrls.isEmpty()) {
            for (String fileUrl : fileUrls) {
                String decodedUrl = decodeUrl(fileUrl);
                String fileName = extractFileNameFromUrl(decodedUrl);
>>>>>>> origin/main

                if (fileName != null) {
                    String result = s3Service.deleteFile(fileName);
                    log.info(result); // Ghi log việc xóa file từ S3
                }
            }
        }
        //Đánh dấu đã xóa
        post.setDeleted(true);
        post.setModifiedDate(Instant.now()); // Cập nhật thời gian sửa
        postRepository.save(post);

<<<<<<< HEAD

    public ApiResponse<Void> deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<String> fileUrls = post.getFileUrls();

        if (fileUrls != null && !fileUrls.isEmpty()) {
            for (String fileUrl : fileUrls) {
                String decodedUrl = decodeUrl(fileUrl);
                String fileName = extractFileNameFromUrl(decodedUrl);

                if (fileName != null) {
                    String result = s3Service.deleteFiles(fileName);
                    log.info(result);
                }
            }
        }
        postRepository.delete(post);

=======
>>>>>>> origin/main
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Post marked as deleted successfully")
                .build();
    }

<<<<<<< HEAD
    //public PageResponse<PostResponse> getMyPosts(int page, int size) -> Controller sẽ đơn giản hơn
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(int page, int size) {
=======

    public ApiResponse<PageResponse<PostResponse>> getMyPosts(int page, int size, boolean includeDeleted) {
>>>>>>> origin/main
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByUserId(userID, pageable);

<<<<<<< HEAD
=======
        // Lọc bài viết, bao gồm hoặc loại trừ bài viết đã xóa
>>>>>>> origin/main
        List<Post> filteredPosts = pageData.getContent().stream()
                .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                        (post.getVisibility() == PostVisibility.FRIENDS && isFriend(userID, post.getUserId())) ||
                        post.getVisibility() == PostVisibility.PRIVATE)
<<<<<<< HEAD
                .toList();
        // TODO thông báo khi có người share, like, cmt bài viết của mình
=======
                .filter(post -> includeDeleted || !post.isDeleted()) // Lọc bài viết đã xóa
                .collect(Collectors.toList());
>>>>>>> origin/main

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(200)
                .message("My posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
<<<<<<< HEAD
                        .data(filteredPosts.stream().map(postMapper::toPostResponse).toList())
=======
                        .data(filteredPosts.stream().map(postMapper::toPostResponse).collect(Collectors.toList()))
>>>>>>> origin/main
                        .build())
                .build();
    }

<<<<<<< HEAD
=======
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<PostResponse>> getMyPostsHistory(int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByUserId(userID, pageable);

        List<Post> filteredPosts = pageData.getContent().stream()
                .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                        (post.getVisibility() == PostVisibility.FRIENDS && isFriend(userID, post.getUserId())) ||
                        post.getVisibility() == PostVisibility.PRIVATE)
                .collect(Collectors.toList());

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(200)
                .message("My posts history retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(filteredPosts.stream().map(postMapper::toPostResponse).collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PostResponse> sharePost(String postId, String content, PostVisibility visibility) {
        // Tìm bài gốc theo postId
        Post originalPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra xem bài gốc đã bị đánh dấu xóa hay chưa
        if (originalPost.isDeleted()) {
            throw new RuntimeException("Cannot share a deleted post.");
        }

        // Kiểm tra quyền chia sẻ dựa trên visibility của bài viết
        if (originalPost.getVisibility() == PostVisibility.PRIVATE &&
                !originalPost.getUserId().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
            throw new RuntimeException("You are not authorized to share this post.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        // Lấy URL của các file từ bài viết gốc, nếu có
        List<String> fileUrls = originalPost.getFileUrls() != null ?
                List.copyOf(originalPost.getFileUrls()) : List.of();

        // Tạo một bản ghi SharedPost thay vì Post
        SharedPost sharedPost = SharedPost.builder()
                .content(content)
                .userId(currentUserId)
                .fileUrls(fileUrls)
                .visibility(visibility)
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .commentCount(0)
                .originalPost(originalPost)
                .build();

        // Lưu bài viết chia sẻ mới vào SharedPostRepository
        sharedPost = sharedPostRepository.save(sharedPost);

        // Sử dụng ShareMapper để ánh xạ SharedPost sang PostResponse
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post shared successfully")
                .result(shareMapper.toPostResponse(sharedPost))
                .build();
    }


>>>>>>> origin/main
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
<<<<<<< HEAD
=======

>>>>>>> origin/main
}