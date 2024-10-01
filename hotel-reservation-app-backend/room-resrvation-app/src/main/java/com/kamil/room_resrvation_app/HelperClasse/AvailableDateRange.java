package com.kamil.room_resrvation_app.HelperClasse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Setter
@Getter
@AllArgsConstructor
public class AvailableDateRange {

    private LocalDate startDate;
    private LocalDate endDate;
}

