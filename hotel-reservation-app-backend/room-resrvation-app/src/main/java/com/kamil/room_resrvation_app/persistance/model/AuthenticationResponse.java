package com.kamil.room_resrvation_app.persistance.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Collection;

@AllArgsConstructor
@Getter
public class AuthenticationResponse {
    private Long id;
    private Collection<String> roles;
    private String token;
}
