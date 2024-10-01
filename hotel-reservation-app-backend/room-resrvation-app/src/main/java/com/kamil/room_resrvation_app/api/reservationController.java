package com.kamil.room_resrvation_app.api;

import com.kamil.room_resrvation_app.persistance.model.RequestModels.*;
import com.kamil.room_resrvation_app.service.ReservationHistoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import com.kamil.room_resrvation_app.HelperClasse.AvailableDateRange;
import com.kamil.room_resrvation_app.persistance.model.Reservation;
import com.kamil.room_resrvation_app.persistance.model.embedded.ReservationDates;
import com.kamil.room_resrvation_app.service.ReservationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin
public class reservationController {
    private final ReservationService reservationService;
    private final ReservationHistoryService reservationHistoryService;

    @GetMapping("/admin/reservations")
    public List<ReservationAdminGetModel> getRooms() {
        return reservationService.getAllReservationsAdminModel();
    }


    @GetMapping("/admin/reservations/{reservationId}")
    public ReservationAdminGetModel getReservationById(@PathVariable Long reservationId) {
        return reservationService.getReservationById(reservationId);
    }

    @GetMapping("/user/{userId}/reservations")
    public List<ReservationUserGetModel> getReservationsByAppUserId(@PathVariable Long userId) {
        return reservationService.getAllReservationsByAppUserId(userId);
    }

    @GetMapping("/user/reservations/{roomId}/reserved-dates")
    public List<AvailableDateRange> getAllReservedDates(@PathVariable Long roomId) {
        return reservationService.getAllReservedDates(roomId);
    }

    @PostMapping("/user/reservations")
    public Reservation addReservation(@RequestBody ReservationRequest reservationRequest) {
        Long appUserId = reservationRequest.getAppUserId();
        Long roomId = reservationRequest.getRoomId();
        ReservationDates reservationDates = reservationRequest.getReservationDates();
        String status = reservationRequest.getStatus();

        return reservationService.addReservation(appUserId, roomId, reservationDates, status);
    }

    @PutMapping("/admin/reservations/{reservationId}")
    public Reservation updateReservation(
            @PathVariable Long reservationId,
            @RequestBody ReservationUpdateModel reservationUpdateModel) {
        return reservationService.updateReservation(reservationId, reservationUpdateModel);
    }

    @PutMapping("/admin/reservations/{reservationId}/status")
    public Reservation updateReservationStatus(@PathVariable Long reservationId, @RequestBody Map<String, String> requestBody) {
        String status = requestBody.get("status");
        System.out.println(status);
        return reservationService.updateReservationStatus(reservationId, status);
    }


    @DeleteMapping("/user/reservations/{id}/delete")
    public void deleteReservationUser(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }

    @DeleteMapping("/admin/reservations/{id}/delete")
    public void deleteReservationAdmin(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }


    //// Reservation HISTORY ////
    @GetMapping("/admin/reservations/history")
    public Page<ReservationAdminGetModel> getReservationHistory(Pageable pageable) {
        return reservationHistoryService.getAllReservationHistory(pageable);
    }

    @GetMapping("/admin/reservations/history-statistics")
    public List<ReservationHistoryStatisticsModel> getAllHistoryStatistics() {
        return reservationHistoryService.getAllHistoryStatistics();
    }
}
