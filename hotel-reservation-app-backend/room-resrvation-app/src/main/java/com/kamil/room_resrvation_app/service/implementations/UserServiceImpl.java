package com.kamil.room_resrvation_app.service.implementations;

import com.kamil.room_resrvation_app.persistance.model.AppUser;
import com.kamil.room_resrvation_app.persistance.repository.AppUserRepository;
import com.kamil.room_resrvation_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private AppUserRepository userRepository;
    @Override
    public void saveUser(AppUser user) {
        userRepository.save(user);
    }
}
