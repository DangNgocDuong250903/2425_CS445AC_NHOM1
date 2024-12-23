package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostGroupResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostGroup;
import com.LinkVerse.post.entity.SharedPost;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
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
        postResponse.language( post.getLanguage() );
        postResponse.primarySentiment( post.getPrimarySentiment() );

        return postResponse.build();
    }

    @Override
    public PostGroupResponse toPostGroupResponse(PostGroup post) {
        if ( post == null ) {
            return null;
        }

        PostGroupResponse.PostGroupResponseBuilder postGroupResponse = PostGroupResponse.builder();

        postGroupResponse.groupId( post.getGroupId() );
        postGroupResponse.id( post.getId() );
        postGroupResponse.content( post.getContent() );
        List<String> list = post.getImageUrl();
        if ( list != null ) {
            postGroupResponse.imageUrl( new ArrayList<String>( list ) );
        }
        postGroupResponse.userId( post.getUserId() );
        postGroupResponse.createdDate( post.getCreatedDate() );
        postGroupResponse.modifiedDate( post.getModifiedDate() );
        postGroupResponse.like( post.getLike() );
        postGroupResponse.unlike( post.getUnlike() );
        postGroupResponse.commentCount( post.getCommentCount() );
        postGroupResponse.comments( commentListToCommentResponseList( post.getComments() ) );
        postGroupResponse.sharedPost( sharedPostListToPostGroupResponseList( post.getSharedPost() ) );
        postGroupResponse.language( post.getLanguage() );
        postGroupResponse.primarySentiment( post.getPrimarySentiment() );

        return postGroupResponse.build();
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

    protected PostGroupResponse sharedPostToPostGroupResponse(SharedPost sharedPost) {
        if ( sharedPost == null ) {
            return null;
        }

        PostGroupResponse.PostGroupResponseBuilder postGroupResponse = PostGroupResponse.builder();

        postGroupResponse.id( sharedPost.getId() );
        postGroupResponse.content( sharedPost.getContent() );
        List<String> list = sharedPost.getImageUrl();
        if ( list != null ) {
            postGroupResponse.imageUrl( new ArrayList<String>( list ) );
        }
        postGroupResponse.userId( sharedPost.getUserId() );
        postGroupResponse.createdDate( sharedPost.getCreatedDate() );
        postGroupResponse.modifiedDate( sharedPost.getModifiedDate() );
        postGroupResponse.like( sharedPost.getLike() );
        postGroupResponse.unlike( sharedPost.getUnlike() );
        postGroupResponse.commentCount( sharedPost.getCommentCount() );
        postGroupResponse.comments( commentListToCommentResponseList( sharedPost.getComments() ) );
        postGroupResponse.language( sharedPost.getLanguage() );
        postGroupResponse.primarySentiment( sharedPost.getPrimarySentiment() );

        return postGroupResponse.build();
    }

    protected List<PostGroupResponse> sharedPostListToPostGroupResponseList(List<SharedPost> list) {
        if ( list == null ) {
            return null;
        }

        List<PostGroupResponse> list1 = new ArrayList<PostGroupResponse>( list.size() );
        for ( SharedPost sharedPost : list ) {
            list1.add( sharedPostToPostGroupResponse( sharedPost ) );
        }

        return list1;
    }
}
