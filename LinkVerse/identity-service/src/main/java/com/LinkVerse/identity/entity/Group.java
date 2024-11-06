package com.LinkVerse.identity.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "name", unique = true, nullable = false)
    String name;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @Column(name = "created_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    Date createdDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "group_status", nullable = false)
    GroupStatus status = GroupStatus.PUBLIC;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    User owner;

    @ManyToMany(mappedBy = "groups")
    Set<User> members;

    @Column(name = "member_count", nullable = false)
    int memberCount;

    @PrePersist
    protected void onCreate() {
        this.createdDate = new Date();
    }
}