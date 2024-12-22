package com.LinkVerse.post.controller;

import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostGroupRequest;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.request.SharePostRequest;
import com.LinkVerse.post.dto.response.PostGroupResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostVisibility;
import com.LinkVerse.post.service.PostGroupService;
import com.LinkVerse.post.service.PostService;
import com.LinkVerse.post.service.TranslationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/group")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostGroupController {

    PostGroupService postGroupService;

    @PostMapping(value = "/post-file")
    public ResponseEntity<ApiResponse<PostGroupResponse>> createPostWithImage(
            @RequestPart("request") String requestJson,
            @RequestPart("files") List<MultipartFile> files) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        PostGroupRequest request = objectMapper.readValue(requestJson, PostGroupRequest.class);

        ApiResponse<PostGroupResponse> response = postGroupService.createPostGroup(request, files);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable String id) {
        log.info("Delete post request: {}", id);
        ApiResponse<Void> response = postGroupService.deletePost(id);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{groupId}/{postId}")
    public ApiResponse<PostGroupResponse> getPostById(@PathVariable String postId, @PathVariable String groupId) {
        return postGroupService.getPostById(postId,groupId);
    }

    @GetMapping("/all")
    public ApiResponse<PageResponse<PostGroupResponse>> getAllPost(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String groupId) {
        return postGroupService.getAllPost(page, size, groupId);
    }

    @GetMapping("/user-posts")
    public ApiResponse<PageResponse<PostGroupResponse>> getAllUserPost(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String userId,
            @RequestParam String groupId) {
        return postGroupService.getUserPost(page, size, userId, groupId);
    }

}