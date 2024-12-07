package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.SharedPost;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class ShareMapperImpl implements ShareMapper {

    @Override
    public PostResponse toPostResponse(SharedPost sharedPost) {
        if ( sharedPost == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.sharedPost( postToPostResponse( sharedPost.getOriginalPost() ) );
        List<String> list = sharedPost.getImageUrl();
        if ( list != null ) {
            postResponse.imageUrl( new ArrayList<String>( list ) );
        }
        postResponse.id( sharedPost.getId() );
        postResponse.content( sharedPost.getContent() );
        postResponse.visibility( sharedPost.getVisibility() );
        postResponse.userId( sharedPost.getUserId() );
        postResponse.createdDate( sharedPost.getCreatedDate() );
        postResponse.modifiedDate( sharedPost.getModifiedDate() );
        postResponse.like( sharedPost.getLike() );
        postResponse.unlike( sharedPost.getUnlike() );
        postResponse.commentCount( sharedPost.getCommentCount() );

        return postResponse.build();
    }

    protected CommentResponse commentToCommentResponse(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        CommentResponse.CommentResponseBuilder commentResponse = CommentResponse.builder();

        commentResponse.id( comment.getId() );
        commentResponse.userId( comment.getUserId() );
        commentResponse.content( comment.getContent() );
        commentResponse.createdDate( comment.getCreatedDate() );
        commentResponse.like( comment.getLike() );
        commentResponse.unlike( comment.getUnlike() );

        return commentResponse.build();
    }

    protected List<CommentResponse> commentListToCommentResponseList(List<Comment> list) {
        if ( list == null ) {
            return null;
        }

        List<CommentResponse> list1 = new ArrayList<CommentResponse>( list.size() );
        for ( Comment comment : list ) {
            list1.add( commentToCommentResponse( comment ) );
        }

        return list1;
    }

    protected PostResponse postToPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.id( post.getId() );
        postResponse.content( post.getContent() );
        List<String> list = post.getImageUrl();
        if ( list != null ) {
            postResponse.imageUrl( new ArrayList<String>( list ) );
        }
        postResponse.visibility( post.getVisibility() );
        postResponse.userId( post.getUserId() );
        postResponse.createdDate( post.getCreatedDate() );
        postResponse.modifiedDate( post.getModifiedDate() );
        postResponse.like( post.getLike() );
        postResponse.unlike( post.getUnlike() );
        postResponse.commentCount( post.getCommentCount() );
        postResponse.comments( commentListToCommentResponseList( post.getComments() ) );
        postResponse.sharedPost( postToPostResponse( post.getSharedPost() ) );
        postResponse.language( post.getLanguage() );
        postResponse.primarySentiment( post.getPrimarySentiment() );

        return postResponse.build();
    }
}
