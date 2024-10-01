package com.kamil.room_resrvation_app.persistance.model;

import com.kamil.room_resrvation_app.persistance.model.embedded.RoomContent;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    @GeneratedValue
    @Column(name="id", unique = true, updatable = false)
    private Long id;
    private int roomNumber;
    private String roomType;
    private int pricePerNight;
    private int Capacity;
    private String photoUrl;

    @Embedded
    private RoomContent roomContent;
}


