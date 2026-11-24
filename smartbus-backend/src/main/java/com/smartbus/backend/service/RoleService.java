package com.smartbus.backend.service;

import com.smartbus.backend.entity.Role;
import com.smartbus.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(Integer roleId) {
        return roleRepository.findById(roleId);
    }

    public void deleteRole(Integer roleId) {
        roleRepository.deleteById(roleId);
    }
}