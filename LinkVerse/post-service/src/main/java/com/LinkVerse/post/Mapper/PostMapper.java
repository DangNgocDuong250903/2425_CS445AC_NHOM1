package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import org.mapstruct.Mapper;

@Mapper
public interface PostMapper {
    PostResponse toPostResponse(Post post);
}
