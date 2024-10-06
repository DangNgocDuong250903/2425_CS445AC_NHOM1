package com.LinkVerse.profile.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private int code = 1000;

    private String message;
    private T result;
    private boolean success;


    public ApiResponse(boolean b, String message) {
        this.success = b;
        this.message = message;
    }
    public ApiResponse(HttpStatus httpStatus, String message) {
        this.code = httpStatus.value();
        this.message = message;
    }

}