package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.SharedPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ShareMapper {

    ShareMapper INSTANCE = Mappers.getMapper(ShareMapper.class);

    // Ánh xạ SharedPost sang PostResponse
    @Mapping(source = "originalPost", target = "sharedPost", qualifiedByName = "mapOriginalPost")
    @Mapping(target = "fileUrl", expression = "java(sharedPost.getFileUrls() != null ? String.join(\",\", sharedPost.getFileUrls()) : null)")
    PostResponse toPostResponse(SharedPost sharedPost);

    // Hàm hỗ trợ ánh xạ từ bài gốc
    @Named("mapOriginalPost")
    default PostResponse mapOriginalPost(Post originalPost) {
        if (originalPost == null) {
            return null;
        }

        // Ánh xạ bài gốc sang PostResponse
        return PostResponse.builder()
                .id(originalPost.getId())
                .content(originalPost.getContent())
                .fileUrl(originalPost.getFileUrls() != null ? String.join(",", originalPost.getFileUrls()) : null)
                .visibility(originalPost.getVisibility())
                .userId(originalPost.getUserId())
                .createdDate(originalPost.getCreatedDate())
                .modifiedDate(originalPost.getModifiedDate())
                .like(originalPost.getLike())
                .unlike(originalPost.getUnlike())
                .commentCount(originalPost.getCommentCount())
                .build();
    }
}