package com.kamil.room_resrvation_app.api;

import com.kamil.room_resrvation_app.persistance.model.AppUser;
import com.kamil.room_resrvation_app.persistance.model.AuthenticationResponse;
import com.kamil.room_resrvation_app.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AppUser request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AppUser request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
