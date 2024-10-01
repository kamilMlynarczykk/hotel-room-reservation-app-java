package com.kamil.room_resrvation_app.service.implementations;

import com.kamil.room_resrvation_app.persistance.model.AppUser;
import com.kamil.room_resrvation_app.persistance.model.AuthenticationResponse;
import com.kamil.room_resrvation_app.persistance.repository.AppUserRepository;
import com.kamil.room_resrvation_app.service.AuthenticationService;
import com.kamil.room_resrvation_app.service.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(AppUser request){
        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(request.getRoles());
        user = appUserRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(user.getId(), user.getRoles(), token);
    }

    public AuthenticationResponse authenticate(AppUser request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        AppUser user = appUserRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(user.getId(), user.getRoles(), token);
    }
}
