package com.kamil.room_resrvation_app.service.implementations;

import com.kamil.room_resrvation_app.HelperClasse.AvailableDateRange;
import com.kamil.room_resrvation_app.HelperClasse.ReservationConflictException;
import com.kamil.room_resrvation_app.HelperClasse.ResourceNotFoundException;
import com.kamil.room_resrvation_app.persistance.model.AppUser;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationAdminGetModel;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationUpdateModel;
import com.kamil.room_resrvation_app.persistance.model.RequestModels.ReservationUserGetModel;
import com.kamil.room_resrvation_app.persistance.model.Reservation;
import com.kamil.room_resrvation_app.persistance.model.ReservationHistory;
import com.kamil.room_resrvation_app.persistance.model.Room;
import com.kamil.room_resrvation_app.persistance.model.embedded.ReservationDates;
import com.kamil.room_resrvation_app.persistance.repository.AppUserRepository;
import com.kamil.room_resrvation_app.persistance.repository.ReservationRepository;
import com.kamil.room_resrvation_app.persistance.repository.ReservationHistoryRepository;
import com.kamil.room_resrvation_app.persistance.repository.RoomRepository;
import com.kamil.room_resrvation_app.service.ReservationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private ReservationHistoryRepository reservationHistoryRepository;
    private AppUserRepository appUserRepository;
    private RoomRepository roomRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository, AppUserRepository appUserRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.appUserRepository = appUserRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public Reservation addReservation(Long appUserId, Long roomId, ReservationDates reservationDates, String status) {
        AppUser appUser = appUserRepository.findById(appUserId)
                .orElseThrow(() -> new ResourceNotFoundException("AppUser not found with id: " + appUserId));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        boolean isOverlapping = reservationRepository.existsByRoomAndReservationDatesOverlap(room, reservationDates.getStartDate(), reservationDates.getEndDate());

        if (isOverlapping) {
            throw new ReservationConflictException("The room is already reserved for the selected dates. Please choose a different date range.");
        }

        Reservation reservation = new Reservation();
        reservation.setReservationDates(reservationDates);
        reservation.setStatus(status);
        reservation.setAppUser(appUser);
        reservation.setRoom(room);

        return reservationRepository.save(reservation);
    }



    @Override
    public void deleteReservation(Long id) {
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Reservation with id " + id + " not found");
        }
    }

    @Override
    public ReservationAdminGetModel getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + id));
        ReservationAdminGetModel model = new ReservationAdminGetModel();
        model.setStartDate(String.valueOf(reservation.getReservationDates().getStartDate()));
        model.setEndDate(String.valueOf(reservation.getReservationDates().getEndDate()));
        model.setStatus(reservation.getStatus());
        model.setRoomNumber(reservation.getRoom().getRoomNumber());
        model.setUsername(reservation.getAppUser().getUsername());
        model.setRoomId(reservation.getRoom().getId());
        model.setPhotoUrl(reservation.getRoom().getPhotoUrl());
        model.setPricePerNight(reservation.getRoom().getPricePerNight());
        return model;
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public List<ReservationUserGetModel> getAllReservationsByAppUserId(Long id) {
        List<Reservation> reservations = reservationRepository.findAllByAppUserId(id);

        // Convert Reservation to ReservationUserGetModel
        return reservations.stream().map(reservation -> {
            ReservationUserGetModel model = new ReservationUserGetModel();
            model.setStartDate(String.valueOf(reservation.getReservationDates().getStartDate()));
            model.setEndDate(String.valueOf(reservation.getReservationDates().getEndDate()));
            model.setStatus(reservation.getStatus());
            model.setRoomNumber(reservation.getRoom().getRoomNumber());
            model.setRoomType(reservation.getRoom().getRoomType());
            model.setRoomId(reservation.getRoom().getId());
            model.setPhotoUrl(reservation.getRoom().getPhotoUrl());
            model.setPricePerNight(reservation.getRoom().getPricePerNight());
            model.setReservationId(reservation.getId());
            return model;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ReservationAdminGetModel> getAllReservationsAdminModel() {
        List<Reservation> reservations = reservationRepository.findAll();

        // Convert Reservation to ReservationAdminGetModel
        return reservations.stream().map(reservation -> {
            ReservationAdminGetModel model = new ReservationAdminGetModel();
            model.setReservationId(reservation.getId());
            model.setStartDate(String.valueOf(reservation.getReservationDates().getStartDate()));
            model.setEndDate(String.valueOf(reservation.getReservationDates().getEndDate()));
            model.setAddedDate(String.valueOf(reservation.getReservationDates().getAddedDate()));
            model.setStatus(reservation.getStatus());
            model.setUsername(reservation.getAppUser().getUsername());
            model.setRoomNumber(reservation.getRoom().getRoomNumber());
            model.setRoomId(reservation.getRoom().getId());
            model.setPhotoUrl(reservation.getRoom().getPhotoUrl());
            model.setPricePerNight(reservation.getRoom().getPricePerNight());
            return model;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Reservation> findAllByAppUserId(Long id) {
        return reservationRepository.findAllByAppUserId(id);
    }

    @Override
    public Reservation updateReservation(Long reservationId, ReservationUpdateModel reservationUpdateModel) {
        // Retrieve the existing reservation from the repository
        Reservation existingReservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + reservationId));

        // Retrieve all reservations for the same room
        List<Reservation> reservationsForRoom = reservationRepository.findByRoom(existingReservation.getRoom());

        // Check for date collision with other reservations for the same room
        for (Reservation reservation : reservationsForRoom) {
            // Skip checking against the current reservation being updated
            if (!reservation.getId().equals(reservationId)) {
                // Ensure that both start and end dates are not null and check for overlap
                if (reservationUpdateModel.getStartDate() != null && reservationUpdateModel.getEndDate() != null) {
                    if (isDateOverlap(
                            reservationUpdateModel.getStartDate(),
                            reservationUpdateModel.getEndDate(),
                            reservation.getReservationDates().getStartDate(),
                            reservation.getReservationDates().getEndDate())) {
                        throw new IllegalArgumentException("New reservation dates overlap with an existing reservation.");
                    }
                }
            }
        }

        // If no collision, proceed to update the reservation dates
        ReservationDates updatedReservationDates = new ReservationDates(
                reservationUpdateModel.getStartDate(),
                reservationUpdateModel.getEndDate(),
                existingReservation.getReservationDates().getAddedDate());

        existingReservation.setReservationDates(updatedReservationDates);

        return reservationRepository.save(existingReservation);
    }

    @Override
    public Reservation updateReservationStatus(Long reservationId, String status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + reservationId));

        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }

    // Utility method to check if two date ranges overlap
    private boolean isDateOverlap(LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }

    @Override
    public List<AvailableDateRange> getAllReservedDates(Long roomId) {
        List<Reservation> reservations = reservationRepository.findAllByRoomId(roomId);
        return reservations.stream()
                .map(reservation -> new AvailableDateRange(reservation.getReservationDates().getStartDate(), reservation.getReservationDates().getEndDate()))
                .collect(Collectors.toList());
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * ?") // This will run every day at midnight
    public void moveReservationsToHistory() {
        // Fetch all reservations (or add filters if needed, such as only completed reservations)
        List<Reservation> reservations = reservationRepository.findAll();

        LocalDate currentDate = LocalDate.now(); // Get current date

        // Loop through each reservation and convert it to ReservationHistory if endDate is before current date
        for (Reservation reservation : reservations) {
            // Check if the reservation's end date is before the current date
            if (reservation.getReservationDates().getEndDate().isBefore(currentDate)) {
                ReservationHistory reservationHistory = new ReservationHistory();
                reservationHistory.setReservationDates(reservation.getReservationDates());
                reservationHistory.setStatus("Archived");
                reservationHistory.setAppUser(reservation.getAppUser());
                reservationHistory.setRoom(reservation.getRoom());

                // Save to ReservationHistory
                reservationHistoryRepository.save(reservationHistory);

                // Delete from Reservation
                reservationRepository.delete(reservation);
            }
        }
    }
}
