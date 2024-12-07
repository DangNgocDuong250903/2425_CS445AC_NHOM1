package com.LinkVerse.profile.dto.response;


import com.LinkVerse.profile.entity.FriendshipStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendshipResponse {
    String senderUsername;
    String recipientUsername;
    FriendshipStatus status;
}