package com.LinkVerse.identity.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "`groups`")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "description")
    String description;

    // Owner of the group, references the User entity
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    User owner;

    // Users in the group with a specific role
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<GroupMember> members;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    GroupVisibility visibility; // Thêm field visibility

    @Column(name = "member_count", nullable = false)
    int memberCount; // Thêm field memberCount


}
