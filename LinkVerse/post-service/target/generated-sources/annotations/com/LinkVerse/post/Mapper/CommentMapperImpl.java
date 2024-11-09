package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.entity.Post;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class CommentMapperImpl implements CommentMapper {

    @Override
    public CommentResponse toPostResponse(Post post) {
        if ( post == null ) {
            return null;
        }

        CommentResponse.CommentResponseBuilder commentResponse = CommentResponse.builder();

        commentResponse.id( post.getId() );
        commentResponse.userId( post.getUserId() );
        commentResponse.content( post.getContent() );
        commentResponse.createdDate( post.getCreatedDate() );
        commentResponse.like( post.getLike() );
        commentResponse.unlike( post.getUnlike() );

        return commentResponse.build();
    }
}
