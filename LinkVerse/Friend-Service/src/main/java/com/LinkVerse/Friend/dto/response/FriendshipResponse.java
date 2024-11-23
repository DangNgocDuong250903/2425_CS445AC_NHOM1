package com.LinkVerse.Friend.dto;

import com.LinkVerse.Friend.entity.FriendshipStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendshipResponse {
    private String senderUsername;
    private String recipientUsername;
    private FriendshipStatus status;
}