package com.kamil.room_resrvation_app.persistance.repository;

import com.kamil.room_resrvation_app.persistance.model.ReservationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationHistoryRepository extends JpaRepository<ReservationHistory, Long> {
}
