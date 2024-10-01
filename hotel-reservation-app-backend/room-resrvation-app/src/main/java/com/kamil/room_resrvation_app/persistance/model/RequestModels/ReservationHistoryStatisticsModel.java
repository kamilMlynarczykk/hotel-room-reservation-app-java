package com.kamil.room_resrvation_app.persistance.model.RequestModels;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationHistoryStatisticsModel {
    private LocalDate startDate;
    private LocalDate endDate;
    private int roomNumber;
    private String roomType;
}
