package com.LinkVerse.Friend.service;

import com.LinkVerse.Friend.entity.User;
import com.LinkVerse.Friend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class searchUsersService {
    private final UserRepository userRepository;
    private final BlockService blockService;

    public List<User> searchUsers(String query) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        List<User> users = userRepository.findByUsernameContaining(query);
        users.removeIf(user -> blockService.isBlocked(currentUserId, user.getId()));

        return users;
    }
}