package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
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
public class PostHistoryMapperImpl implements PostHistoryMapper {

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
        postResponse.comments( commentListToCommentResponseList( postHistory.getComments() ) );
        postResponse.sharedPost( postHistory.getSharedPost() );

        return postResponse.build();
    }

    protected CommentResponse commentToCommentResponse(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        CommentResponse.CommentResponseBuilder commentResponse = CommentResponse.builder();

        commentResponse.id( comment.getId() );
        commentResponse.userId( comment.getUserId() );
        List<String> list = comment.getImageUrl();
        if ( list != null ) {
            commentResponse.imageUrl( new ArrayList<String>( list ) );
        }
        commentResponse.commentId( comment.getCommentId() );
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
}
