package com.LinkVerse.profile.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.*;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Node("Role")
public class Role {
    @Id
    @GeneratedValue
    Long id;

    @Property("name")
    String name;

    @Property("description")
    String description;

    @Relationship(type = "HAS_PERMISSION", direction = Relationship.Direction.OUTGOING)
    Set<Permission> permissions;
}