package com.kamil.room_resrvation_app.HelperClasse;

// Custom exception for invalid input or conflict
public class ReservationConflictException extends RuntimeException {
    public ReservationConflictException(String message) {
        super(message);
    }
}