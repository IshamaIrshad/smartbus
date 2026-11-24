package com.smartbus.backend.service;

import com.smartbus.backend.entity.Admin;
import com.smartbus.backend.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Integer userId) {
        return adminRepository.findById(userId);
    }

    public void deleteAdmin(Integer userId) {
        adminRepository.deleteById(userId);
    }
}