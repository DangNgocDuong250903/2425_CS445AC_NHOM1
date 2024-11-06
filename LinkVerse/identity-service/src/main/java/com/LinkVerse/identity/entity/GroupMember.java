package com.LinkVerse.identity.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    Group group;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    MemberRole role = MemberRole.MEMBER; // Giá trị mặc định là MEMBER
}
