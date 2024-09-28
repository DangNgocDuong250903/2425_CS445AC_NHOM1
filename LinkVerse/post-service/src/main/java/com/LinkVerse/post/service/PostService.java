package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostMapper postMapper;

    public PostResponse createPost(PostRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();  //get token lay userID
        
        Post post = Post.builder()
                .content(request.getContent())
                .userId(authentication.getName())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .build();


        post =  postRepository.save(post);
        return postMapper.toPostResponse(post);
    }
    public PageResponse<PostResponse> getMyPosts(int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();  //get token lay userID
        String userID = authentication.getName();


        //Tạo một đối tượng Sort để sắp xếp danh sách bài đăng theo createdDate (ngày tạo) giảm dần (desc).
        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page -1, size,sort);

        var pageData = postRepository.findAllByUserId(userID, pageable);

//        return postRepository.findAllByUserId(userID).stream()
//                .map(postMapper::toPostResponse)
//                .toList();
        return PageResponse.<PostResponse>builder()
                .currentPage(page)  //page tu fontend truyen vao
                .pageSize(pageData.getSize()) //sl
                .totalPage(pageData.getTotalPages()) //tong so trang
                .totalElement(pageData.getTotalElements()) //tong so bai dang
                .data(pageData.getContent().stream().map(postMapper::toPostResponse).toList()) //ds bai dang hien tai -> chuyen doi sang PostResponse
                .build();
    }
}
