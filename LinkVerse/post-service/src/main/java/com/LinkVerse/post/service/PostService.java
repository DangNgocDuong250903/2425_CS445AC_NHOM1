package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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
    public List<PostResponse> getMyPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();  //get token lay userID
        String userID = authentication.getName();
        return postRepository.findAllByUserId(userID).stream()
                .map(postMapper::toPostResponse)
                .toList();
    }
}
