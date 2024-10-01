package com.kamil.room_resrvation_app.persistance.model.embedded;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ReservationDates {

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate addedDate;
}
