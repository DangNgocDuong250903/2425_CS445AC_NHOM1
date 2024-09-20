package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
            List<Post> findAllByUserId(String userId);
    //phương thức tùy chỉnh (custom query method).
    // Spring Data MongoDB sẽ tự động tạo ra truy vấn cho bạn dựa trên tên của phương thức.
}
