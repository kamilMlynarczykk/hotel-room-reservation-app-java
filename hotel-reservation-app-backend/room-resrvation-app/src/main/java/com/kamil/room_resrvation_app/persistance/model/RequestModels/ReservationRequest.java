// src/main/java/com/yourpackage/dto/ReservationRequest.java
package com.kamil.room_resrvation_app.persistance.model.RequestModels;

import com.kamil.room_resrvation_app.persistance.model.embedded.ReservationDates;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequest {
    private Long appUserId;
    private Long roomId;
    private ReservationDates reservationDates;
    private String status;
}
