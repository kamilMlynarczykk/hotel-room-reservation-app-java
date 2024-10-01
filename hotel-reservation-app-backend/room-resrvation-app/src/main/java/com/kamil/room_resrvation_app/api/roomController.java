package com.kamil.room_resrvation_app.api;

import com.kamil.room_resrvation_app.persistance.model.Room;
import com.kamil.room_resrvation_app.service.RoomService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin
public class roomController {


    private RoomService roomService;

    @GetMapping("/rooms")
    public List<Room> getRooms(@RequestParam(value = "startDate", required = false) LocalDate startDate,
                               @RequestParam(value = "endDate", required = false) LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return roomService.getRoomsByDate(startDate.plusDays(1), endDate.plusDays(1));
        } else {
            return roomService.getAllRooms();
        }
    }

    @GetMapping("/user/rooms/{id}")
    public Optional<Room> getRoomsById(@PathVariable Long id) {
        return roomService.getRoomsById(id);
    }

    @PutMapping("/admin/rooms/{id}/edit")
    public void updateRoom(@RequestBody Room room) {
        roomService.updateRoom(room);
    }

    @DeleteMapping("/admin/rooms/{id}/delete")
    public void deleteRoomById(@PathVariable Long id) {
        roomService.deleteRoomById(id);
    }

    @PostMapping("/admin/rooms/add")
    public void addRoom(@RequestBody Room room) {
        roomService.addRoom(room);
    }
}
