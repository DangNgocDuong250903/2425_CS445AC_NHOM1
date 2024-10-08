package com.LinkVerse.post.controller;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.service.PostService;
import com.LinkVerse.post.service.SearchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchController {
        final SearchService searchService;
        final PostMapper postMapper;
            @GetMapping("/search")
public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> searchPost(
        @RequestParam(value = "content", required = false) String content,
        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
        @RequestParam(value = "size", required = false, defaultValue = "10") int size
) {
    log.info("Search posts with content: {}", content);
    // Không bọc lại trong một ApiResponse khác
    ApiResponse<PageResponse<PostResponse>> response = searchService.searchPost(content, page, size);
    return ResponseEntity.ok(response);
}

}
