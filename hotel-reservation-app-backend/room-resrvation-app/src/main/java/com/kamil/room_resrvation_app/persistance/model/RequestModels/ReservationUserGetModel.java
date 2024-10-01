package com.kamil.room_resrvation_app.persistance.model.RequestModels;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationUserGetModel {
    private String startDate;
    private String endDate;
    private String status;
    private int roomNumber;
    private String roomType;
    private long roomId;
    private String photoUrl;
    private int pricePerNight;
    private Long reservationId;
}
