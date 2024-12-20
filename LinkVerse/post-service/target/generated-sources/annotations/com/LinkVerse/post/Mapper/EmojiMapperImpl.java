package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.EmojiResponse;
import com.LinkVerse.post.entity.Emoji;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class EmojiMapperImpl implements EmojiMapper {

    @Override
    public EmojiResponse toEmojiResponse(Emoji emoji) {
        if ( emoji == null ) {
            return null;
        }

        EmojiResponse.EmojiResponseBuilder emojiResponse = EmojiResponse.builder();

        emojiResponse.symbol( emoji.getSymbol() );
        emojiResponse.name( emoji.getName() );

        return emojiResponse.build();
    }
}
