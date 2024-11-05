// package com.LinkVerse.friend.entity;
//
// import lombok.*;
// import lombok.experimental.FieldDefaults;
// import org.springframework.data.neo4j.core.schema.GeneratedValue;
// import org.springframework.data.neo4j.core.schema.Id;
// import org.springframework.data.neo4j.core.schema.Node;
// import org.springframework.data.neo4j.core.schema.Property;
// import org.springframework.data.neo4j.core.support.UUIDStringGenerator;
//
// @Getter
// @Setter
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// @FieldDefaults(level = AccessLevel.PRIVATE)
// @Node("picture")
// public class Picture {
//       @Id
//    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
//    String id;
//       @Property("userId") //Map ben indentity -Service
//    String userId;
//    String imageurl;
//    String description;
//    String cloudinaryPublicId;
// }
