package com.kamil.room_resrvation_app.persistance.repository;

import com.kamil.room_resrvation_app.persistance.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
        Optional<Room> findFirstById(Long id);
}
