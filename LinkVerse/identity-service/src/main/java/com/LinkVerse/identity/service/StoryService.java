package com.LinkVerse.identity.service;

import com.LinkVerse.identity.dto.request.StoryCreationRequest;
import com.LinkVerse.identity.dto.response.StoryResponse;
import com.LinkVerse.identity.entity.Story;
import com.LinkVerse.identity.entity.StoryVisibility;
import com.LinkVerse.identity.entity.User;
import com.LinkVerse.identity.exception.AppException;
import com.LinkVerse.identity.exception.ErrorCode;
import com.LinkVerse.identity.mapper.StoryMapper;
import com.LinkVerse.identity.repository.StoryRepository;
import com.LinkVerse.identity.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoryService {
    StoryRepository storyRepository;
    UserRepository userRepository;
    StoryMapper storyMapper;
    AuthenticationService authenticationService;
    int STORY_EXPIRATION_HOURS = 24;

    public StoryResponse createStory(StoryCreationRequest request, String token) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Story story = storyMapper.toStory(request);
        story.setUser(user);
        story.setPostedAt(LocalDateTime.now());
        story.setExpiryTime(LocalDateTime.now().plusHours(STORY_EXPIRATION_HOURS));

        story.setVisibility(request.getVisibility());

        story = storyRepository.save(story);

        return storyMapper.toStoryResponse(story);
    }

    public List<StoryResponse> getActiveStories(String token) {
        String userId = authenticationService.getUserIdFromToken(token);
        LocalDateTime now = LocalDateTime.now();

        List<Story> activeStories = storyRepository
                .findAllByExpiryTimeAfterAndVisibilityOrUserIdAndExpiryTimeAfter(now, StoryVisibility.PUBLIC, userId, now);

        return activeStories.stream()
                .map(storyMapper::toStoryResponse)
                .collect(Collectors.toList());
    }


    public void deleteStory(String storyId, String token) {
        String userId = authenticationService.getUserIdFromToken(token);

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new AppException(ErrorCode.STORY_NOT_EXISTED));

        if (!story.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        storyRepository.delete(story);

        log.info("Story with id {} deleted successfully by user {}", storyId, userId);
    }

}
