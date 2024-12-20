//package com.LinkVerse.identity.service;
//
//import com.LinkVerse.identity.dto.request.ApiResponse;
//import com.LinkVerse.identity.dto.request.PostRequest;
//import com.LinkVerse.identity.dto.response.PostResponse;
//import com.LinkVerse.identity.entity.Group;
//import com.LinkVerse.identity.entity.GroupMember;
//import com.LinkVerse.identity.entity.User;
//import com.LinkVerse.identity.exception.AppException;
//import com.LinkVerse.identity.exception.ErrorCode;
//import com.LinkVerse.identity.mapper.CommentMapper;
//import com.LinkVerse.identity.mapper.PostMapper;
//import com.LinkVerse.identity.repository.GroupMemberRepository;
//import com.LinkVerse.identity.repository.GroupRepository;
//import com.LinkVerse.identity.repository.PostRepository;
//import com.LinkVerse.identity.repository.UserRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.time.Instant;
//
//@Service
//@RequiredArgsConstructor
//public class PostGroupService {
//     private final GroupRepository groupRepository;
//    private final PostRepository postRepository;
//    private final PostMapper postMapper;
//    private final CommentMapper commentMapper;
//    UserRepository userRepository;
//    GroupMemberRepository groupMemberRepository;
//@Transactional
//    public ApiResponse<PostResponse> createPostInGroup(String groupId, PostRequest request) {
//        // Lấy thông tin người dùng hiện tại từ SecurityContext
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String userId = authentication.getName();
//
//        // Kiểm tra xem người dùng có tồn tại không
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
//
//        // Kiểm tra nhóm tồn tại
//        Group group = groupRepository.findById(groupId)
//                .orElseThrow(() -> new AppException(ErrorCode.GROUP_NOT_EXIST));
//
//        // Kiểm tra xem người dùng có phải là thành viên của nhóm không
//        GroupMember member = groupMemberRepository.findByGroupAndUser(group, user)
//                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_DENIED));
//
//        // Tạo bài viết mới
//        Post post = Post.builder()
//                .userId(userId)
//                .group(group)
//                .content(request.getContent())
//                .createdDate(Instant.now())
//                .modifiedDate(Instant.now())
//                .like(0)
//                .unlike(0)
//                .commentCount(0)
//                .build();
//
//        // Lưu bài viết vào cơ sở dữ liệu
//        post = postRepository.save(post);
//
//        // Sử dụng PostMapper để chuyển đổi Post thành PostResponse
//        PostResponse response = postMapper.toPostResponseWithShared(post);
//
//        return ApiResponse.<PostResponse>builder()
//                .code(200)
//                .message("Post created successfully in the group")
//                .result(response)
//                .build();
//    }
//}
//
