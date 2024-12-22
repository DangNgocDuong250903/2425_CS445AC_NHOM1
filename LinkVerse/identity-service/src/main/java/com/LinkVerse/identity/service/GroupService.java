package com.LinkVerse.identity.service;

import com.LinkVerse.identity.dto.request.ApiResponse;
import com.LinkVerse.identity.dto.request.GroupRequest;
import com.LinkVerse.identity.dto.response.GroupResponse;
import com.LinkVerse.identity.entity.Group;
import com.LinkVerse.identity.entity.GroupMember;
import com.LinkVerse.identity.entity.User;
import com.LinkVerse.identity.exception.AppException;
import com.LinkVerse.identity.exception.ErrorCode;
import com.LinkVerse.identity.repository.GroupMemberRepository;
import com.LinkVerse.identity.repository.GroupRepository;
import com.LinkVerse.identity.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupService {
    GroupRepository groupRepository;
    GroupMemberRepository groupMemberRepository;
    UserRepository userRepository;
    GroupEventProducer groupEventProducer;

    @Transactional
    public ApiResponse<GroupResponse> createGroup(GroupRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            log.info("Admin đang tạo nhóm: " + request.getName());
        }

        String userId = authentication.getName();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (groupRepository.findByName(request.getName()).isPresent()) {
            throw new AppException(ErrorCode.GROUP_ALREADY_EXISTS);
        }

        Group group = Group.builder()
                .name(request.getName())
                .description(request.getDescription())
                .visibility(request.getVisibility())
                .memberCount(1)
                .owner(user)
                .build();

        group = groupRepository.save(group);

        GroupMember.MemberRole creatorRole = isAdmin ? GroupMember.MemberRole.OWNER : GroupMember.MemberRole.LEADER;

        GroupMember groupMember = GroupMember.builder()
                .group(group)
                .user(user)
                .role(creatorRole)
                .build();
        groupMemberRepository.save(groupMember);
        groupEventProducer.publishGroupCreatedEvent(group, creatorRole.name());
        return ApiResponse.<GroupResponse>builder()
                .code(200)
                .message("Group created successfully")
                .result(GroupResponse.builder()
                        .id(group.getId())
                        .name(group.getName())
                        .description(group.getDescription())
                        .memberCount(group.getMemberCount())
                        .visibility(group.getVisibility().name())
                        .build())
                .build();
    }


    @Transactional
    public ApiResponse<GroupResponse> addMemberToGroup(String groupId, String memberId) {
        // Lấy thông tin xác thực hiện tại từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String requesterId = authentication.getName();

        // Kiểm tra requester tồn tại
        User requester = userRepository.findById(requesterId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new AppException(ErrorCode.GROUP_NOT_EXIST));

        // Kiểm tra quyền của requester (phải là LEADER hoặc OWNER)
        GroupMember requesterMember = groupMemberRepository
                .findByGroupAndUser(group, requester)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_DENIED));

        // Chỉ OWNER hoặc LEADER mới có quyền thêm thành viên
        if (requesterMember.getRole() != GroupMember.MemberRole.OWNER &&
                requesterMember.getRole() != GroupMember.MemberRole.LEADER) {
            throw new AppException(ErrorCode.PERMISSION_DENIED);
        }

        // Kiểm tra xem người dùng cần thêm có tồn tại không
        User member = userRepository.findById(memberId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra xem người dùng đã là thành viên của nhóm chưa
        if (groupMemberRepository.findByGroupAndUser(group, member).isPresent()) {
            throw new AppException(ErrorCode.ALREADY_MEMBER);
        }

        // Đặt vai trò cho thành viên mới: nếu là OWNER thêm vào thì gán vai trò LEADER, nếu LEADER hoặc MEMBER thêm thì gán vai trò MEMBER
        GroupMember.MemberRole newMemberRole = (requesterMember.getRole() == GroupMember.MemberRole.OWNER)
                ? GroupMember.MemberRole.LEADER
                : GroupMember.MemberRole.MEMBER;

        // Thêm người dùng mới vào nhóm với vai trò tương ứng
        GroupMember newMember = GroupMember.builder()
                .group(group)
                .user(member)
                .role(newMemberRole)
                .build();
        groupMemberRepository.save(newMember);

        // Cập nhật số lượng thành viên của nhóm
        group.setMemberCount(group.getMemberCount() + 1);
        groupRepository.save(group);

        groupEventProducer.publishMemberAddedEvent(groupId, newMemberRole.name());

        // Trả về thông tin chi tiết của nhóm
        GroupResponse groupResponse = GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .memberCount(group.getMemberCount())
                .visibility(group.getVisibility().name())
                .build();
        return ApiResponse.<GroupResponse>builder()
                .code(200)
                .message("Member added successfully")
                .result(groupResponse)
                .build();
    }

    @Transactional
    public ApiResponse<GroupResponse> getGroupById(String groupId) {
        // Lấy thông tin nhóm từ database
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new AppException(ErrorCode.GROUP_NOT_EXIST));

        // Tạo phản hồi từ thông tin nhóm
        GroupResponse groupResponse = GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .memberCount(group.getMemberCount())
                .visibility(group.getVisibility().name())
                .build();

        // Trả về API Response
        return ApiResponse.<GroupResponse>builder()
                .code(200)
                .message("Group found successfully")
                .result(groupResponse)
                .build();
    }

    @Transactional
    public boolean isUserInGroup(String groupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new AppException(ErrorCode.GROUP_NOT_EXIST));

        return groupMemberRepository.findByGroupAndUser(group, userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED))).isPresent();
    }

}
