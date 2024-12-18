package com.LinkVerse.identity.controller;

import com.LinkVerse.identity.dto.request.ApiResponse;
import com.LinkVerse.identity.dto.request.UserCreationRequest;
import com.LinkVerse.identity.dto.request.UserUpdateRequest;
import com.LinkVerse.identity.dto.request.UserUpdateRequestAdmin;
import com.LinkVerse.identity.dto.response.UserResponse;
import com.LinkVerse.identity.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping("/registration")
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }


    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @PatchMapping("/my-profile/status")
    public ApiResponse<UserResponse> updateMyStatus(@RequestParam String status) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateStatus(userId, status))
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequestAdmin request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @PutMapping("/my-profile")
    ApiResponse<UserResponse> updateUserbyUsers(@RequestBody UserUpdateRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUserbyUsers(userId, request))
                .build();
    }


}
