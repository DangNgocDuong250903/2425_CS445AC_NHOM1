package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface    PostRepository extends MongoRepository<Post, String> {
            Page<Post> findAllByUserId(String userId, Pageable pageable);
    //phương thức tùy chỉnh (custom query method).
    // Spring Data MongoDB sẽ tự động tạo ra truy vấn cho bạn dựa trên tên của phương thức.
}
