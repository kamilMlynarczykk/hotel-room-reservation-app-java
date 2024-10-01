package com.kamil.room_resrvation_app.service.implementations;

import com.kamil.room_resrvation_app.persistance.model.Reservation;
import com.kamil.room_resrvation_app.persistance.model.Room;
import com.kamil.room_resrvation_app.persistance.repository.ReservationRepository;
import com.kamil.room_resrvation_app.persistance.repository.RoomRepository;
import com.kamil.room_resrvation_app.service.RoomService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@AllArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomsById(Long id) {
        return roomRepository.findFirstById(id);
    }

    public Room updateRoom(Room room) {
        try{
            return roomRepository.save(room);
        }catch (Exception e){
            throw new IllegalArgumentException("Room details have to be a non-negative number");
        }
    }

    @Override
    public void deleteRoomById(Long id) {
        roomRepository.deleteById(id);
    }

    @Override
    public void addRoom(Room room) {
        roomRepository.save(room);
    }

    @Override
    public List<Room> getRoomsByDate(LocalDate startDate, LocalDate endDate) {
        List<Reservation> reservations = reservationRepository.findAllByReservationDatesBetween(startDate, endDate);
        List<Room> rooms = roomRepository.findAll();
        rooms.removeAll(reservations.stream().map(Reservation::getRoom).toList());
        return rooms;
    }
}
