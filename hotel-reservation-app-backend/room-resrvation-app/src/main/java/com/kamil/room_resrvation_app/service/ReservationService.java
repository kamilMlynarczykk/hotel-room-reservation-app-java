package com.kamil.room_resrvation_app.service;

import com.kamil.room_resrvation_app.HelperClasse.AvailableDateRange;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationRequest;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationAdminGetModel;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationUpdateModel;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationUserGetModel;
import com.kamil.room_resrvation_app.persistance.model.Reservation;
import com.kamil.room_resrvation_app.persistance.model.embedded.ReservationDates;

import java.util.List;

public interface ReservationService {
    Reservation addReservation(Long appUserId, Long roomId, ReservationDates reservationDates, String status);
    void deleteReservation(Long id);
    ReservationAdminGetModel getReservationById(Long id);
    List<Reservation> getAllReservations();
    List<ReservationUserGetModel> getAllReservationsByAppUserId(Long id);
    List<ReservationAdminGetModel> getAllReservationsAdminModel();

    List<Reservation> findAllByAppUserId(Long id);

    Reservation updateReservation(Long reservationId, ReservationUpdateModel reservationUpdateModel);

    Reservation updateReservationStatus(Long reservationId, String status);

    public List<AvailableDateRange> getAllReservedDates(Long roomId);

    public void moveReservationsToHistory();
}
