package com.LinkVerse.identity.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.LinkVerse.identity.dto.request.ApiResponse;
import com.LinkVerse.identity.dto.request.GroupRequest;
import com.LinkVerse.identity.dto.response.GroupResponse;
import com.LinkVerse.identity.service.GroupService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

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

    @PostMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<ApiResponse<GroupResponse>> addMemberToGroup(
            @PathVariable String groupId, @PathVariable String memberId) {

        ApiResponse<GroupResponse> response = groupService.addMemberToGroup(groupId, memberId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}")
    public ApiResponse<GroupResponse> getGroup(@PathVariable String groupId) {
        return groupService.getGroupById(groupId);
    }
}
