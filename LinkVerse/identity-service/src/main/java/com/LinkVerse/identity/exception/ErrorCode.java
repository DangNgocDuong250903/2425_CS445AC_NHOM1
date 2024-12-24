package com.LinkVerse.identity.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1009, "Invalid email", HttpStatus.BAD_REQUEST),
    PROFILE_CREATION_FAILED(1010, "Profile creation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED_ACCESS(1011, "Unauthorized access", HttpStatus.FORBIDDEN),
    GROUP_NOT_EXISTED(1012, "Group not existed", HttpStatus.NOT_FOUND),
    INVALID_TOKEN(1013, "Invalid token", HttpStatus.BAD_REQUEST),
    MEMBER_NOT_FOUND(1014, "Member not found", HttpStatus.NOT_FOUND),
    GROUP_ALREADY_EXISTS(1015, "Group already exists", HttpStatus.BAD_REQUEST),
    USER_ALREADY_MEMBER(1016, "User already a member", HttpStatus.BAD_REQUEST),
    GROUP_NOT_EXIST(1017, "Group not exist", HttpStatus.NOT_FOUND),
    PERMISSION_DENIED(1018, "Permission denied", HttpStatus.FORBIDDEN),
    ALREADY_MEMBER(1019, "Already a member", HttpStatus.BAD_REQUEST),
    GROUP_NOT_FOUND(1020, "Group not found", HttpStatus.NOT_FOUND),
    USER_NOT_IN_GROUP(1021, "User not in group", HttpStatus.FORBIDDEN),
    STORY_NOT_EXISTED(1022, "Story not existed", HttpStatus.NOT_FOUND),
    FORBIDDEN(1023, "Forbidden", HttpStatus.FORBIDDEN),
    JSON_PROCESSING_FAILED(1024, "JSON processing failed", HttpStatus.INTERNAL_SERVER_ERROR),
    POST_CREATION_FAILED(1025, "Post creation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_DELETED(1026, "User deleted", HttpStatus.BAD_REQUEST),
    PROFILE_DELETION_FAILED(1027, "Profile deletion failed", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
