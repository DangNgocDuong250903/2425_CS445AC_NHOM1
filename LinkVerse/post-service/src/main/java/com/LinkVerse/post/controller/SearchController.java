package com.LinkVerse.post.controller;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.PostRepository;
import com.LinkVerse.post.service.KeywordService;
import com.LinkVerse.post.service.SearchService;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchController {
    final SearchService searchService;
    final PostMapper postMapper;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private KeywordService keywordService;

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

    @GetMapping("/sorts")
    ApiResponse<PageResponse<PostResponse>> getUsersWithSortsBy(@RequestParam(defaultValue = "0",required = false) int page,
                                                                       @Min(2)@RequestParam(defaultValue = "3",required = false) int size,
                                                                       @RequestParam(required = false) String... sorts){
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(searchService.sortPost(page, size, sorts))
                .build();
    }

//    @GetMapping(value = "/search-posts", produces = "application/json")
//    public ApiResponse<List<PostDocument>> searchPosts(
//            @RequestParam(value = "searchString", required = false) String searchString,
//            @RequestParam(value = "year", required = false) Integer year,
//            @RequestParam(value = "month", required = false) Integer month,
//            @RequestParam(value = "visibility", required = false) PostVisibility visibility) {
//
//        return searchService.searchPosts(searchString, year, month, visibility);
//    }

    // Tìm kiếm bài đăng theo từ khóa
    @GetMapping("/searchPostKeyword")
    public ApiResponse<List<PostResponse>> searchPostsByKeyword(@RequestParam String keyword) {
        try {
            // Lấy ID của từ khóa từ keywordService
            List<String> keywordIds = keywordService.getKeywordIdsFromPhrase(keyword);

            // Tìm kiếm bài đăng chứa từ khóa
            List<Post> posts = postRepository.findByKeywordsIn(keywordIds);

            // Chuyển đổi các bài đăng thành phản hồi
            List<PostResponse> postResponses = posts.stream()
                    .map(post -> postMapper.toPostResponse(post))
                    .collect(Collectors.toList());

            return ApiResponse.<List<PostResponse>>builder()
                    .code(200)
                    .message("Search results")
                    .result(postResponses)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<List<PostResponse>>builder()
                    .code(500)
                    .message("Error occurred while searching for posts.")
                    .build();
        }
    }
}
