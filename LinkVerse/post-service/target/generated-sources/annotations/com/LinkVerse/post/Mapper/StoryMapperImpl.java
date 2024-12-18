package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.request.StoryCreationRequest;
import com.LinkVerse.post.dto.response.StoryResponse;
import com.LinkVerse.post.entity.Story;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class StoryMapperImpl implements StoryMapper {

    @Override
    public Story toEntity(StoryCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Story.StoryBuilder story = Story.builder();

        story.visibility( request.getVisibility() );

        return story.build();
    }

    @Override
    public StoryResponse toResponse(Story story) {
        if ( story == null ) {
            return null;
        }

        StoryResponse storyResponse = new StoryResponse();

        storyResponse.setId( story.getId() );
        List<String> list = story.getImageUrl();
        if ( list != null ) {
            storyResponse.setImageUrl( new ArrayList<String>( list ) );
        }
        storyResponse.setPostedAt( story.getPostedAt() );
        storyResponse.setExpiryTime( story.getExpiryTime() );
        storyResponse.setVisibility( story.getVisibility() );

        return storyResponse;
    }
}
