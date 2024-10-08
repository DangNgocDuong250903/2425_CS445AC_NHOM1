package com.LinkVerse.post.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
@Document(value = "Emoji")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Emoji {
    String symbol;
    String name;
        public static List<Emoji> getAllEmojis() {
        return Arrays.asList(
                new Emoji("😀", "grinning face"),
                new Emoji("😂", "face with tears of joy"),
                new Emoji("❤️", "red heart"),
                new Emoji("👍", "thumbs up"),
                new Emoji("😢", "crying face")
                //Mún thêm thì cứ như trên, kéo xún
        );
    }
}
