package com.LinkVerse.identity.dto.response;

import com.LinkVerse.identity.entity.UserStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id; //users id
    String username;
    UserStatus status = UserStatus.ONLINE;
    String email;
    String profileId;
    boolean emailVerified;
    Set<RoleResponse> roles;
}
