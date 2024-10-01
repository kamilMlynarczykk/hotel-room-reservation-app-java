package com.kamil.room_resrvation_app.HelperClasse;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
