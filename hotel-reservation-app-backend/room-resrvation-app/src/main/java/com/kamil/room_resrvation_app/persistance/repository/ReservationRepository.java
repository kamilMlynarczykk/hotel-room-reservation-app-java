package com.kamil.room_resrvation_app.persistance.repository;

import com.kamil.room_resrvation_app.persistance.model.Reservation;
import com.kamil.room_resrvation_app.persistance.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findAllByAppUserId(Long id);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Reservation r " +
            "WHERE r.room = :room " +
            "AND (r.reservationDates.startDate < :endDate " +
            "AND r.reservationDates.endDate > :startDate)")
    boolean existsByRoomAndReservationDatesOverlap(@Param("room") Room room,
                                                   @Param("startDate") LocalDate startDate,
                                                   @Param("endDate") LocalDate endDate);

    List<Reservation> findAllByRoomId(Long id);

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.reservationDates.startDate >= :today ORDER BY r.reservationDates.startDate")
    List<Reservation> findByRoomIdAndEndDateAfterOrderByStartDate(@Param("roomId") Long roomId, @Param("today") LocalDate today);


    List<Reservation> findByRoom(Room room);

    @Query("SELECT r FROM Reservation r WHERE r.reservationDates.startDate BETWEEN :startDate AND :endDate " +
            "OR r.reservationDates.endDate BETWEEN :startDate AND :endDate " +
            "OR (r.reservationDates.startDate <= :startDate AND r.reservationDates.endDate >= :endDate)")
    List<Reservation> findAllByReservationDatesBetween(LocalDate startDate, LocalDate endDate);
}
