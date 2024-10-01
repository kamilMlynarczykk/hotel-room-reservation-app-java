package com.kamil.room_resrvation_app.persistance.model.RequestModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationUpdateModel {
    private String reservationId;
    private LocalDate startDate;  // Assuming dates are handled as strings
    private LocalDate endDate;
}
