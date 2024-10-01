package com.kamil.room_resrvation_app.persistance.model;

import com.kamil.room_resrvation_app.persistance.model.embedded.ReservationDates;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationHistory {
    @Id
    @GeneratedValue
    @Column(name="id", unique = true, updatable = false)
    private Long id;
    @Embedded
    private ReservationDates reservationDates;
    private String status;

    @ManyToOne
    @JoinColumn(name = "appUser_id", nullable = false)
    private AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}
