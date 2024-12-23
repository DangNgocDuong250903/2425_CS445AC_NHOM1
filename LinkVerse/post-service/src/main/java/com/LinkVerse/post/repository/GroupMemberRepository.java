package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Group;
import com.LinkVerse.post.entity.GroupMember;
import com.LinkVerse.post.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends MongoRepository<GroupMember, String> {

    List<GroupMember> findByGroupId(String groupId);

    Optional<GroupMember> findByGroupIdAndUserId(String groupId, String userId);

    Optional<GroupMember> findByGroupAndUser(Group group, User newMember);

    boolean existsByGroupIdAndUserIdAndRole(String groupId, String userId, GroupMember.MemberRole role);
}