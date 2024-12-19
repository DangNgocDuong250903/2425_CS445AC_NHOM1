package com.LinkVerse.Friend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.LinkVerse.Friend.entity.User;
import com.LinkVerse.Friend.service.searchUsersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SearchUsersController {
    private final searchUsersService searchUsersService;

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = searchUsersService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
}
