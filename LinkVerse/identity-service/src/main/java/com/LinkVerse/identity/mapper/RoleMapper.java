package com.LinkVerse.identity.mapper;

import com.LinkVerse.identity.dto.request.RoleRequest;
import com.LinkVerse.identity.dto.response.RoleResponse;
import com.LinkVerse.identity.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
