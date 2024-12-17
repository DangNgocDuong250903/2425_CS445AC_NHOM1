package com.LinkVerse.profile.controller;

import com.LinkVerse.profile.dto.ApiResponse;
import com.LinkVerse.profile.dto.PageResponse;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.service.UserProfileService;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {
    UserProfileService userProfileService;

    @PutMapping("/{userId}")
    public ResponseEntity<Void> updateImage(@PathVariable("userId") String userId,  @RequestParam String imageFile) {
        try {
            userProfileService.updateImage(userId, imageFile);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/users/{profileId}")
    ApiResponse<UserProfileResponse> getProfile(@PathVariable String profileId) {
        return ApiResponse.<UserProfileResponse>builder()
                .result(userProfileService.getProfile(profileId))
                .build();
    }

    @GetMapping("/users")
    ApiResponse<List<UserProfileResponse>> getAllProfiles() {
        return ApiResponse.<List<UserProfileResponse>>builder()
                .result(userProfileService.getAllProfiles())
                .build();
    }

    @GetMapping("/users/my-profile")
    ApiResponse<UserProfileResponse> getMyProfile() {
        return ApiResponse.<UserProfileResponse>builder()
                .result(userProfileService.getMyProfile())
                .build();
    }

    @GetMapping("/sorts")
    ApiResponse<PageResponse<UserProfileResponse>> getUsersWithSortsBy(@RequestParam(defaultValue = "0",required = false) int page,
                                                                       @Min(2)@RequestParam(defaultValue = "3",required = false) int size,
                                                                       @RequestParam(required = false) String... sorts){
        return ApiResponse.<PageResponse<UserProfileResponse>>builder()
                .result(userProfileService.getUsersWithSortsByMultipleColumn(page, size, sorts))
                .build();
    }

    @GetMapping("/search")
    ApiResponse<PageResponse<UserProfileResponse>> getUsersWithSortByColumnAndSearch(@RequestParam(defaultValue = "0",required = false) int page,
                                                                              @Min(2)@RequestParam(defaultValue = "3",required = false) int size,
                                                                              @RequestParam(required = false) String search,
                                                                              @RequestParam(required = false) String sortBy
    ){
        return ApiResponse.<PageResponse<UserProfileResponse>>builder()
                .result(userProfileService.getUsersWithSortByColumnAndSearch(page, size,search,sortBy))
                .build();
    }

    @GetMapping("/criteria-search")
    ApiResponse<PageResponse<UserProfileResponse>> advancedSearchByCriteria(@RequestParam(defaultValue = "0",required = false) int page,
                                                                     @Min(2)@RequestParam(defaultValue = "3",required = false) int size,
                                                                     @RequestParam(required = false) String sortBy,
                                                                     @RequestParam(required = false) String... search//=String[] search
    ){
        return ApiResponse.<PageResponse<UserProfileResponse>>builder()
                .result(userProfileService.advancedSearchByCriteria(page, size,sortBy,search))
                .build();
    }

    @GetMapping("/advanced-search")
    ApiResponse<PageResponse<UserProfileResponse>> advanceSearchWithSpecifications(Pageable pageable,
                                                                                   @RequestParam(required = false) String[] user
    ){
        return ApiResponse.<PageResponse<UserProfileResponse>>builder()
                .result(userProfileService.advanceSearchWithSpecifications(pageable, user))
                .build();
    }

}