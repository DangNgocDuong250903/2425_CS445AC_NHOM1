package com.LinkVerse.profile.service;

import com.LinkVerse.profile.dto.PageResponse;
import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.entity.UserStatus;
import com.LinkVerse.profile.exception.AppException;
import com.LinkVerse.profile.exception.ErrorCode;
import com.LinkVerse.profile.mapper.UserProfileMapper;
import com.LinkVerse.profile.repository.SearchRepository.SearchRepository;
import com.LinkVerse.profile.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.LinkVerse.profile.enums.AppConst.SORT_BY;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper userProfileMapper;
    SearchRepository searchRepository;


    public void updateImage(String userId, String imageUrl) {
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userProfile.setImageUrl(imageUrl);
        userProfileRepository.save(userProfile);
    }

    public UserProfileResponse createProfile(ProfileCreationRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileReponse(userProfile);
    }

    public UserProfileResponse getByUserId(String userId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();

        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));


        return userProfileMapper.toUserProfileReponse(userProfile);
    }


    public UserProfileResponse getProfile(String id) {
        UserProfile userProfile =
                userProfileRepository.findById(id).orElseThrow(
                        () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileReponse(userProfile);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfileResponse> getAllProfiles() {
        var profiles = userProfileRepository.findAll();

        return profiles.stream().map(userProfileMapper::toUserProfileReponse).toList();
    }

    public UserProfileResponse getMyProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        var profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileReponse(profile);
    }


    // 0
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserProfileResponse> getUsersWithSortsByMultipleColumn(int pageNo, int pageSize, String... sorts) {
        int p = 0;
        if (pageNo > 0) {
            p = pageNo - 1;
        }
        List<Sort.Order> orders = new ArrayList<>();
        if (sorts != null) {
            for (String sortBy : sorts) {
                //firstName:asc,lastName:desc
                Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
                Matcher matcher = pattern.matcher(sortBy);
                if (matcher.find()) {
                    if (matcher.group(3).equalsIgnoreCase("asc")) {
                        orders.add(new Sort.Order(Sort.Direction.ASC, matcher.group(1)));
                    } else {
                        orders.add(new Sort.Order(Sort.Direction.DESC, matcher.group(1)));
                    }
                }
            }
        }

        Pageable pageable = PageRequest.of(p, pageSize, Sort.by(orders));

        Page<UserProfile> users = userProfileRepository.findAll(pageable);
        return PageResponse.<UserProfileResponse>builder()
                .page(pageNo)
                .size(pageSize)
                .total(users.getTotalPages())
                .items(users.stream().map(userProfileMapper::toUserProfileReponse).toList())
                .build();
    }

    // 1
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserProfileResponse> getUsersWithSortByColumnAndSearch(int pageNo, int pageSize, String search, String sortBy) {
        Page<UserProfile> users = searchRepository.getUsersWithSortByColumnAndSearch(pageNo, pageSize, sortBy, search);
        return PageResponse.<UserProfileResponse>builder()
                .page(users.getNumber())
                .size(users.getSize())
                .total(users.getTotalPages())
                .items(users.stream().map(userProfileMapper::toUserProfileReponse).toList())
                .build();
    }

    // 2
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserProfileResponse> advancedSearchByCriteria(int pageNo, int pageSize, String sortBy, String... search) {
        Page<UserProfile> users = searchRepository.advancedSearchUser(pageNo, pageSize, sortBy, search);
        return PageResponse.<UserProfileResponse>builder()
                .page(users.getNumber())
                .size(users.getSize())
                .total(users.getTotalPages())
                .items(users.stream().map(userProfileMapper::toUserProfileReponse).toList())
                .build();
    }
    // -------------------------------------------------------------------------------------------------------------------

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserProfileResponse> advanceSearchWithSpecifications(Pageable pageable, String[] user) {
        if (user != null) {
            return searchRepository.searchUserByCriteria(pageable, user);
        }

        Page<UserProfile> users = userProfileRepository.findAll(pageable);
        return PageResponse.<UserProfileResponse>builder()
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .total(users.getTotalPages())
                .items(users.stream().map(userProfileMapper::toUserProfileReponse).toList())
                .build();
    }
}