package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Override
    public PostResponse toPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.id( post.getId() );
        postResponse.content( post.getContent() );
        postResponse.fileUrl( post.getFileUrl() );
        postResponse.visibility( post.getVisibility() );
        postResponse.userId( post.getUserId() );
        postResponse.createdDate( post.getCreatedDate() );
        postResponse.modifiedDate( post.getModifiedDate() );
        postResponse.like( post.getLike() );
        postResponse.unlike( post.getUnlike() );
        postResponse.commentCount( post.getCommentCount() );
        postResponse.comments( toCommentResponses( post.getComments() ) );
        postResponse.sharedPost( postToPostResponse( post.getSharedPost() ) );

        return postResponse.build();
    }

    protected PostResponse postToPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.id( post.getId() );
        postResponse.content( post.getContent() );
        postResponse.fileUrl( post.getFileUrl() );
        postResponse.visibility( post.getVisibility() );
        postResponse.userId( post.getUserId() );
        postResponse.createdDate( post.getCreatedDate() );
        postResponse.modifiedDate( post.getModifiedDate() );
        postResponse.like( post.getLike() );
        postResponse.unlike( post.getUnlike() );
        postResponse.commentCount( post.getCommentCount() );
        postResponse.comments( toCommentResponses( post.getComments() ) );
        postResponse.sharedPost( postToPostResponse( post.getSharedPost() ) );

        return postResponse.build();
    }
}
