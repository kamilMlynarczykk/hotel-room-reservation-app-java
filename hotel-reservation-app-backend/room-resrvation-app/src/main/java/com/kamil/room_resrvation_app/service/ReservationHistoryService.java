package com.kamil.room_resrvation_app.service;

import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationAdminGetModel;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationHistoryStatisticsModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReservationHistoryService {
    Page<ReservationAdminGetModel> getAllReservationHistory(Pageable pageable);

    List<ReservationHistoryStatisticsModel> getAllHistoryStatistics();
}
