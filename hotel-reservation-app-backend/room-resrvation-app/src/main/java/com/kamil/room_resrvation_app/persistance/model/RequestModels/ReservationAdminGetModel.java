package com.kamil.room_resrvation_app.persistance.model.RequestModels;

import lombok.Data;

@Data
public class ReservationAdminGetModel {
    private Long reservationId;
    private String startDate;
    private String endDate;
    private String addedDate;
    private String status;
    private int roomNumber;
    private String username;
    private String photoUrl;
    private int pricePerNight;
    private Long roomId;
}

