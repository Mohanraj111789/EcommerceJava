package com.ecommerce.service;

import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    @Transactional
    public User promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalStateException("User is already an admin");
        }
        
        user.setRole(Role.ADMIN);
        return userRepository.save(user);
    }

    @Transactional
    public User demoteToUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        if (user.getRole() == Role.USER) {
            throw new IllegalStateException("User is already a regular user");
        }
        
        user.setRole(Role.USER);
        return userRepository.save(user);
    }
    @Transactional
    public void deleteUser(Long userId)
    {
        if(!userRepository.existsById(userId))
        {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
        return;
    }
}

