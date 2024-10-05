package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostMapper postMapper;

    public PostResponse createPost(PostRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();  //get token lay userID
        
        Post post = Post.builder()
                //lay id post de delete    ->>>>>>> chuwa xoa duoc
                .content(request.getContent())
                .userId(authentication.getName())
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .comments(List.of())
                .build();

        post =  postRepository.save(post);
        return postMapper.toPostResponse(post);
    }


    public PostResponse addComment(String postId, CommentRequest commentRequest) {
            // Tìm bài đăng theo ID
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found")); // Nếu không tìm thấy, ném ngoại lệ

            // Tạo bình luận mới
                Comment newComment = Comment.builder()
            .content(commentRequest.getContent())
            .userId(SecurityContextHolder.getContext().getAuthentication().getName())
            .createdDate(Instant.now())
            .build(); // Gán giá trị từ CommentRequest

            // Thêm bình luận vào danh sách bình luận của bài đăng
            post.getComments().add(newComment);


            // Lưu bài đăng đã cập nhật
            postRepository.save(post);
            // Trả về bài đăng đã cập nhật
            return postMapper.toPostResponse(post);
}
//delete comment
    public PostResponse deleteComment(String postId, String commentId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getComments().removeIf(comment -> comment.getUserId().equals(commentId));
        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    //edit comment
    public PostResponse editComment(String postId, String commentId, CommentRequest commentRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getComments().stream()
                .filter(comment -> comment.getUserId().equals(commentId))
                .findFirst()
                .ifPresent(comment -> {
                    comment.setContent(commentRequest.getContent());
                    comment.setCreatedDate(Instant.now());
                });

        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    //Seach post
    public PageResponse<PostResponse> searchPost(String content, int page, int size) {
        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByContent(content, pageable);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPage(pageData.getTotalPages())
                .totalElement(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(postMapper::toPostResponse).toList())
                .build();
    }

    public PostResponse likePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setLike(post.getLike() + 1);
        post = postRepository.save(post);

        return postMapper.toPostResponse(post);
    }

    public PostResponse deletePost(String PostId ){
        Post post = postRepository.findById(PostId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postRepository.delete(post);
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
