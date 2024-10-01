package com.kamil.room_resrvation_app.service;

import com.kamil.room_resrvation_app.persistance.model.Room;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface RoomService {
    public List<Room> getAllRooms();

    public Optional<Room> getRoomsById(Long id);

    public Room updateRoom(Room room);

    public void deleteRoomById(Long id);

    public void addRoom(Room room);

    List<Room> getRoomsByDate(LocalDate startDate, LocalDate endDate);
}
