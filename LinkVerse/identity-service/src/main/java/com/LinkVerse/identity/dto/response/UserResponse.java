package com.LinkVerse.identity.dto.response;

import java.util.Set;

import com.LinkVerse.identity.entity.UserStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    private UserStatus status = UserStatus.ONLINE;
    String email;
    boolean emailVerified;
    Set<RoleResponse> roles;
}
