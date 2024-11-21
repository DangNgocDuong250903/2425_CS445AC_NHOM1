package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.SharedPost;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class ShareMapperImpl implements ShareMapper {

    @Override
    public PostResponse toPostResponse(SharedPost sharedPost) {
        if ( sharedPost == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.sharedPost( mapOriginalPost( sharedPost.getOriginalPost() ) );
        postResponse.id( sharedPost.getId() );
        postResponse.content( sharedPost.getContent() );
        postResponse.visibility( sharedPost.getVisibility() );
        postResponse.userId( sharedPost.getUserId() );
        postResponse.createdDate( sharedPost.getCreatedDate() );
        postResponse.modifiedDate( sharedPost.getModifiedDate() );
        postResponse.like( sharedPost.getLike() );
        postResponse.unlike( sharedPost.getUnlike() );
        postResponse.commentCount( sharedPost.getCommentCount() );

        postResponse.fileUrl( sharedPost.getFileUrls() != null ? String.join(",", sharedPost.getFileUrls()) : null );

        return postResponse.build();
    }
}
