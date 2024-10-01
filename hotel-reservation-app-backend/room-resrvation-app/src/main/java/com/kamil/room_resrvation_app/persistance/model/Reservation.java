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
@Table(name = "reservation", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"room_id", "start_date"}),
        @UniqueConstraint(columnNames = {"room_id", "end_date"}),
})
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, updatable = false)
    private Long id;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "startDate", column = @Column(name = "start_date", nullable = false)),
            @AttributeOverride(name = "endDate", column = @Column(name = "end_date", nullable = false))
    })
    private ReservationDates reservationDates;
    private String status;

    @ManyToOne
    @JoinColumn(name = "appUser_id", nullable = false)
    private AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}
