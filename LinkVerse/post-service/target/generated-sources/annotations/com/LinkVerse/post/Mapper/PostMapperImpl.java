package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostHistory;
import java.util.ArrayList;
import java.util.List;
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

        postResponse.sharedPost( toPostResponse( post.getSharedPost() ) );
        postResponse.language( post.getLanguage() );
        List<String> list = post.getImageUrl();
        if ( list != null ) {
            postResponse.imageUrl( new ArrayList<String>( list ) );
        }
        postResponse.imgAvatarUrl( post.getImgAvatarUrl() );
        postResponse.visibility( post.getVisibility() );
        postResponse.id( post.getId() );
        postResponse.content( post.getContent() );
        postResponse.userId( post.getUserId() );
        postResponse.createdDate( post.getCreatedDate() );
        postResponse.modifiedDate( post.getModifiedDate() );
        postResponse.like( post.getLike() );
        postResponse.unlike( post.getUnlike() );
        postResponse.commentCount( post.getCommentCount() );
        postResponse.comments( toCommentResponses( post.getComments() ) );
        postResponse.primarySentiment( post.getPrimarySentiment() );

        return postResponse.build();
    }

    @Override
    public PostResponse toPostResponse(PostHistory postHistory) {
        if ( postHistory == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.id( postHistory.getId() );
        postResponse.content( postHistory.getContent() );
        postResponse.visibility( postHistory.getVisibility() );
        postResponse.userId( postHistory.getUserId() );
        postResponse.createdDate( postHistory.getCreatedDate() );
        postResponse.modifiedDate( postHistory.getModifiedDate() );
        postResponse.like( postHistory.getLike() );
        postResponse.unlike( postHistory.getUnlike() );
        postResponse.commentCount( postHistory.getCommentCount() );
        postResponse.comments( toCommentResponses( postHistory.getComments() ) );
        postResponse.sharedPost( postHistory.getSharedPost() );

        return postResponse.build();
    }
}
