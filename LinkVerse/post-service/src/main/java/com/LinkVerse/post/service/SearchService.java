package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    public PageResponse<PostResponse> sortPost(int pageNo, int pageSize, String... sorts) {
        int p = 0;
        if (pageNo > 0) {
            p = pageNo - 1;
        }
        List<Sort.Order> orders = new ArrayList<>();
        if (sorts != null) {
            for (String sortBy : sorts) {
                Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
                Matcher matcher = pattern.matcher(sortBy);
                if (matcher.find()) {
                    if (matcher.group(3).equalsIgnoreCase("asc")) {
                        orders.add(new Sort.Order(Sort.Direction.ASC, matcher.group(1)));
                    } else {
                        orders.add(new Sort.Order(Sort.Direction.DESC, matcher.group(1)));
                    }
                }
            }
        }

        Pageable pageable = PageRequest.of(p, pageSize, Sort.by(orders));

        Page<Post> posts = postRepository.findAll(pageable);
        return PageResponse.<PostResponse>builder()
                .currentPage(pageNo)
                .totalPage(posts.getTotalPages())
                .data(posts.stream().map(postMapper::toPostResponse).toList())
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
