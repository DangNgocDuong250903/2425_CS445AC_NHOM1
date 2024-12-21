package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SearchService {
    PostRepository postRepository;
    PostMapper postMapper;
//    PostSearchRepository postSearchRepository;

    public ApiResponse<PageResponse<PostResponse>> searchPost(String content, int page, int size) {
        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByContent(content, pageable);

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(200)
                .message("Posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(pageData.getContent().stream().map(postMapper::toPostResponse).toList())
                        .build())
                .build();
    }

//    public ApiResponse<List<PostDocument>> searchPosts(String searchString, Integer year, Integer month, PostVisibility visibility) {
//        Set<PostDocument> postDocumentsSet = new HashSet<>();  // tránh lặp -> dùng Set
//
//        // Tìm kiếm theo năm và tháng nếu có
//        if (year != null && month != null) {
//            postDocumentsSet.addAll(postSearchRepository.findByCreatedAtInYearAndMonth(year, month));
//        } else if (year != null) {
//            postDocumentsSet.addAll(postSearchRepository.findByCreatedAtInYear(year));
//        } else {
//            Iterable<PostDocument> allPosts = postSearchRepository.findAll();
//            allPosts.forEach(postDocumentsSet::add);
//        }
//
//        // tìm content/cmt chứa searchString
//        if (StringUtils.hasLength(searchString)) {
//            Set<PostDocument> filteredBySearchString = new HashSet<>();
//
//            filteredBySearchString.addAll(postSearchRepository.findByContentContaining(searchString));
//            filteredBySearchString.addAll(postSearchRepository.findByComments_ContentContaining(searchString));
//
//            postDocumentsSet.retainAll(filteredBySearchString);
//        }
//
//        // Tìm kiếm theo visibility nếu có
//        if (visibility != null) {
//            postDocumentsSet.removeIf(post -> post.getVisibility() != visibility);
//        } else {
//            postDocumentsSet.removeIf(post -> post.getVisibility() != PostVisibility.PUBLIC);
//        }
//
//        // Convert Set to List and return
//        List<PostDocument> postDocumentsList = new ArrayList<>(postDocumentsSet);
//
//        // Trả về kết quả
//        return ApiResponse.<List<PostDocument>>builder()
//                .code(HttpStatus.OK.value())
//                .message("Search results retrieved successfully")
//                .result(postDocumentsList)
//                .build();
//    }


}
