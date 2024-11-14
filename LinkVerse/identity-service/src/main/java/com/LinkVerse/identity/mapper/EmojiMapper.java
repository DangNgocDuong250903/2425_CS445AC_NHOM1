package com.LinkVerse.identity.mapper;


import com.LinkVerse.identity.dto.response.EmojiResponse;
import com.LinkVerse.identity.entity.Emoji;
import org.mapstruct.Mapper;
@Mapper
public interface EmojiMapper {
    EmojiResponse toEmojiResponse(Emoji emoji);
}
