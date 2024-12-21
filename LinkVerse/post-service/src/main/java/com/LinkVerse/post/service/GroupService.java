package com.LinkVerse.post.service;

import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.request.GroupRequest;
import com.LinkVerse.post.dto.response.GroupResponse;
import com.LinkVerse.post.entity.Group;
import com.LinkVerse.post.entity.GroupMember;
import com.LinkVerse.post.entity.GroupVisibility;
import com.LinkVerse.post.entity.User;
import com.LinkVerse.post.exception.AppException;
import com.LinkVerse.post.exception.ErrorCode;
import com.LinkVerse.post.repository.GroupMemberRepository;
import com.LinkVerse.post.repository.GroupRepository;
import com.LinkVerse.post.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupService {
    GroupRepository groupRepository;
    GroupMemberRepository groupMemberRepository;
    UserRepository userRepository;

    @Transactional
    public ApiResponse<GroupResponse> createGroup(GroupRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            log.info("Admin đang tạo nhóm: " + request.getName());
        }

        String userId = authentication.getName();
        log.info("User ID from authentication: " + userId);

        // Check user existence
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (groupRepository.findByName(request.getName()).isPresent()) {
            throw new AppException(ErrorCode.GROUP_ALREADY_EXISTS);
        }

        Group group = Group.builder()
                .name(request.getName())
                .description(request.getDescription())
                .visibility(GroupVisibility.valueOf(request.getVisibility()))
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();
        log.info("User ID from authentication: " + userId);

        // Check user existence
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Group group = groupRepository.findById(groupId).orElseThrow(() -> new AppException(ErrorCode.GROUP_NOT_EXISTED));

        GroupMember requesterMember = groupMemberRepository
                .findByGroupAndUser(group, user)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_DENIED));

        if (requesterMember.getRole() != GroupMember.MemberRole.OWNER &&
                requesterMember.getRole() != GroupMember.MemberRole.LEADER) {
            throw new AppException(ErrorCode.PERMISSION_DENIED);
        }

        User member = userRepository.findById(memberId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (groupMemberRepository.findByGroupAndUser(group, member).isPresent()) {
            throw new AppException(ErrorCode.ALREADY_MEMBER);
        }

        GroupMember.MemberRole newMemberRole = (requesterMember.getRole() == GroupMember.MemberRole.OWNER)
                ? GroupMember.MemberRole.LEADER
                : GroupMember.MemberRole.MEMBER;

        GroupMember newMember = GroupMember.builder()
                .group(group)
                .user(member)
                .role(newMemberRole)
                .build();
        groupMemberRepository.save(newMember);

        group.setMemberCount(group.getMemberCount() + 1);
        groupRepository.save(group);

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
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new AppException(ErrorCode.GROUP_NOT_EXISTED));

        GroupResponse groupResponse = GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .memberCount(group.getMemberCount())
                .visibility(group.getVisibility().name())
                .build();

        return ApiResponse.<GroupResponse>builder()
                .code(200)
                .message("Group found successfully")
                .result(groupResponse)
                .build();
    }
}