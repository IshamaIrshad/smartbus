package com.smartbus.backend.config;

import com.smartbus.backend.entity.Role;
import com.smartbus.backend.repository.RoleRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Makes sure the four roles exist, so registration works on a fresh database.
 * Existing roles are left untouched.
 */
@Configuration
public class RoleSeeder {

    @Bean
    ApplicationRunner seedRoles(RoleRepository roles) {
        return args -> List.of("ADMIN", "DRIVER", "CONDUCTOR", "PASSENGER")
                .forEach(name -> {
                    if (roles.findByRoleName(name).isEmpty()) {
                        Role role = new Role();
                        role.setRoleName(name);
                        roles.save(role);
                    }
                });
    }
}
