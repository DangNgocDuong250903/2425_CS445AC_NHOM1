package com.LinkVerse.identity.mapper;

import com.LinkVerse.identity.dto.response.GroupResponse;
import com.LinkVerse.identity.entity.Group;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GroupMapper {
    GroupResponse toGroupDto(Group group);
    Group toGroup(GroupResponse groupDto);
}