package com.kamil.room_resrvation_app.service;

import com.kamil.room_resrvation_app.persistance.model.AppUser;
import com.kamil.room_resrvation_app.persistance.model.AuthenticationResponse;


import java.util.Optional;

public interface AuthenticationService {

    public AuthenticationResponse register(AppUser request);

    public AuthenticationResponse authenticate(AppUser request);
}
