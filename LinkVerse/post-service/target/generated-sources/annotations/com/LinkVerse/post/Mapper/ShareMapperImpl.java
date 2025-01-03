package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.SharedPost;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class ShareMapperImpl implements ShareMapper {

    @Autowired
    private PostMapper postMapper;

    @Override
    public PostResponse toPostResponse(SharedPost sharedPost) {
        if ( sharedPost == null ) {
            return null;
        }

        PostResponse.PostResponseBuilder postResponse = PostResponse.builder();

        postResponse.id( sharedPost.getId() );
        postResponse.content( sharedPost.getContent() );
        List<String> list = sharedPost.getImageUrl();
        if ( list != null ) {
            postResponse.imageUrl( new ArrayList<String>( list ) );
        }
        postResponse.visibility( sharedPost.getVisibility() );
        postResponse.userId( sharedPost.getUserId() );
        postResponse.createdDate( sharedPost.getCreatedDate() );
        postResponse.modifiedDate( sharedPost.getModifiedDate() );
        postResponse.like( sharedPost.getLike() );
        postResponse.unlike( sharedPost.getUnlike() );
        postResponse.commentCount( sharedPost.getCommentCount() );
        postResponse.sharedPost( postMapper.toPostResponseList( sharedPost.getOriginalPost() ) );
        postResponse.comments( commentListToCommentResponseList( sharedPost.getComments() ) );
        postResponse.language( sharedPost.getLanguage() );
        postResponse.primarySentiment( sharedPost.getPrimarySentiment() );

        return postResponse.build();
    }

    @Override
    public List<PostResponse> toPostResponseList(List<SharedPost> sharedPosts) {
        if ( sharedPosts == null ) {
            return null;
        }

        List<PostResponse> list = new ArrayList<PostResponse>( sharedPosts.size() );
        for ( SharedPost sharedPost : sharedPosts ) {
            list.add( toPostResponse( sharedPost ) );
        }

        return list;
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
