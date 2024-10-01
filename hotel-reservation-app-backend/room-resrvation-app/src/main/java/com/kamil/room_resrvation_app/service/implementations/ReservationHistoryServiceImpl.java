package com.kamil.room_resrvation_app.service.implementations;

import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationAdminGetModel;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationHistoryStatisticsModel;
import com.kamil.room_resrvation_app.persistance.model.ReservationHistory;
import com.kamil.room_resrvation_app.persistance.repository.ReservationHistoryRepository;
import com.kamil.room_resrvation_app.service.ReservationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class ReservationHistoryServiceImpl implements ReservationHistoryService {

    @Autowired
    private ReservationHistoryRepository reservationHistoryRepository;

    @Override
    public Page<ReservationAdminGetModel> getAllReservationHistory(Pageable pageable) {
        Page<ReservationHistory> reservationHistoryPage = reservationHistoryRepository.findAll(pageable);

        // Convert ReservationHistory to ReservationAdminGetModel
        return reservationHistoryPage.map(reservationHistory -> {
            ReservationAdminGetModel model = new ReservationAdminGetModel();
            model.setReservationId(reservationHistory.getId());
            model.setStartDate(String.valueOf(reservationHistory.getReservationDates().getStartDate()));
            model.setEndDate(String.valueOf(reservationHistory.getReservationDates().getEndDate()));
            model.setAddedDate(String.valueOf(reservationHistory.getReservationDates().getAddedDate()));
            model.setStatus(reservationHistory.getStatus());
            model.setUsername(reservationHistory.getAppUser().getUsername());
            model.setRoomNumber(reservationHistory.getRoom().getRoomNumber());
            model.setRoomId(reservationHistory.getRoom().getId());
            model.setPhotoUrl(reservationHistory.getRoom().getPhotoUrl());
            model.setPricePerNight(reservationHistory.getRoom().getPricePerNight());
            return model;
        });
    }

    @Override
    public List<ReservationHistoryStatisticsModel> getAllHistoryStatistics() {
        List<ReservationHistory> reservationHistories = reservationHistoryRepository.findAll();

        // Convert ReservationHistory to ReservationHistoryStatisticsModel
        return reservationHistories.stream().map(reservationHistory -> {
            ReservationHistoryStatisticsModel model = new ReservationHistoryStatisticsModel();
            model.setStartDate(reservationHistory.getReservationDates().getStartDate());
            model.setEndDate(reservationHistory.getReservationDates().getEndDate());
            model.setRoomNumber(reservationHistory.getRoom().getRoomNumber());
            model.setRoomType(reservationHistory.getRoom().getRoomType());
            return model;
        }).collect(Collectors.toList());
    }
}
