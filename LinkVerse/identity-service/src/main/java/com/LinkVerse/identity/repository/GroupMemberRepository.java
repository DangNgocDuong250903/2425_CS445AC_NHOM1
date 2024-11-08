package com.LinkVerse.identity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.LinkVerse.identity.entity.Group;
import com.LinkVerse.identity.entity.GroupMember;
import com.LinkVerse.identity.entity.User;

public interface GroupMemberRepository extends JpaRepository<GroupMember, String> {

    // Lấy tất cả thành viên của một nhóm bằng groupId
    List<GroupMember> findByGroupId(String groupId);

    // Tìm thành viên theo groupId và userId
    Optional<GroupMember> findByGroupIdAndUserId(String groupId, String userId);

    // Tìm thành viên theo đối tượng Group và User
    Optional<GroupMember> findByGroupAndUser(Group group, User newMember);

    // Kiểm tra xem người dùng có vai trò nhất định trong nhóm hay không
    boolean existsByGroupIdAndUserIdAndRole(String groupId, String userId, GroupMember.MemberRole role);
}
