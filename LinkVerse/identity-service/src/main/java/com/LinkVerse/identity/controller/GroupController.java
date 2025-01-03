package com.LinkVerse.identity.controller;

import com.LinkVerse.identity.dto.request.ApiResponse;
import com.LinkVerse.identity.dto.request.GroupRequest;
import com.LinkVerse.identity.dto.response.GroupResponse;
import com.LinkVerse.identity.entity.GroupVisibility;
import com.LinkVerse.identity.service.GroupService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GroupController {
    GroupService groupService;

    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponse>> createGroup(@RequestBody @Valid GroupRequest request) {

        ApiResponse<GroupResponse> response = groupService.createGroup(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}/isUserInGroup")
    public ResponseEntity<Boolean> isUserInGroup(@PathVariable String groupId) {
        boolean isInGroup = groupService.isUserInGroup(groupId);
        return ResponseEntity.ok(isInGroup);
    }

    @GetMapping("/{groupId}/isOwnerOrLeader")
    public ResponseEntity<Boolean> isOwnerorLeader(@PathVariable String groupId) {
        boolean isInGroup = groupService.isUserOwnerOrLeader(groupId);
        return ResponseEntity.ok(isInGroup);
    }

    @GetMapping("/{groupId}/isPublic")
    public ResponseEntity<Boolean> isGroupPublic(@PathVariable String groupId) {
        boolean isPublic = groupService.isGroupPublic(groupId);
        return ResponseEntity.ok(isPublic);
    }


    @PostMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<ApiResponse<GroupResponse>> addMemberToGroup(
            @PathVariable String groupId, @PathVariable String memberId) {

        ApiResponse<GroupResponse> response = groupService.addMemberToGroup(groupId, memberId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{groupId}/visibility")
    public ResponseEntity<GroupResponse> changeGroupVisibility(@PathVariable String groupId, @RequestParam GroupVisibility newVisibility) {
        return ResponseEntity.ok(groupService.changeGroupVisibility(groupId, newVisibility).getResult());
    }

    @GetMapping("/{groupId}")
    public ApiResponse<GroupResponse> getGroup(@PathVariable String groupId) {
        return groupService.getGroupById(groupId);
    }

    @GetMapping("/all")
    public ApiResponse<Page<GroupResponse>> getAllGroup(@RequestParam int page, @RequestParam int size) {
        return groupService.getAllGroup(page, size);
    }


}
