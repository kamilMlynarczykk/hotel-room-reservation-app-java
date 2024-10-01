package com.kamil.room_resrvation_app;

import com.fasterxml.jackson.core.ErrorReportConfiguration;
import com.github.javafaker.Faker;
import com.kamil.room_resrvation_app.persistance.model.AppUser;
import com.kamil.room_resrvation_app.persistance.model.ReservationHistory;
import com.kamil.room_resrvation_app.persistance.model.Room;
import com.kamil.room_resrvation_app.persistance.model.embedded.ReservationDates;
import com.kamil.room_resrvation_app.persistance.model.embedded.RoomContent;
import com.kamil.room_resrvation_app.persistance.repository.ReservationHistoryRepository;
import com.kamil.room_resrvation_app.persistance.repository.RoomRepository;
import com.kamil.room_resrvation_app.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.*;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class }, scanBasePackages = {"com.kamil.room_resrvation_app"})
@EnableScheduling
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
		RoomRepository roomRepository,
		UserService userService,
		PasswordEncoder passwordEncoder,
		ReservationHistoryRepository reservationHistoryRepository
	){
		return args -> {
			Faker faker = new Faker();
			Random random = new Random();

			for (int j = 1; j < 11; j++) {
				Room room = Room.builder()
						.roomNumber(Integer.parseInt(faker.number().digits(3)))
						.roomType(faker.options().option("Single", "Double", "Suite"))
						.Capacity(faker.number().numberBetween(2, 6))
						.pricePerNight(faker.number().numberBetween(100, 500))
						.photoUrl("src/assets/hotel-room"+j+".jpg")
						.roomContent(RoomContent.builder()
								.chairs(faker.number().numberBetween(0, 2))
								.beds(faker.number().numberBetween(0, 2))
								.desks(faker.number().numberBetween(0, 2))
								.balconies(faker.number().numberBetween(0, 2))
								.tvs(faker.number().numberBetween(0, 2))
								.fridges(faker.number().numberBetween(0, 2))
								.kettles(faker.number().numberBetween(0, 2))
								.build())
						.build();
				roomRepository.save(room);
			}
			// Create an admin user
			AppUser adminUser = AppUser.builder()
					.username("admin")
					.password(passwordEncoder.encode("123")) // Encode password
					.roles(List.of("ADMIN")) // Assign the ADMIN role
					.build();

			userService.saveUser(adminUser); // Save user using UserService

			AppUser regularUser1 = AppUser.builder()
					.username("1")
					.password(passwordEncoder.encode("1")) // Encode password
					.roles(List.of("USER")) // Assign the ADMIN role
					.build();

			userService.saveUser(regularUser1); // Save user using UserService

			AppUser regularUser2 = AppUser.builder()
					.username("2")
					.password(passwordEncoder.encode("1")) // Encode password
					.roles(List.of("USER")) // Assign the ADMIN role
					.build();

			userService.saveUser(regularUser2); // Save user using UserService

			List<Room> rooms = roomRepository.findAll();
			Map<Room, List<ReservationDates>> roomReservationsMap = new HashMap<>();

			for (int i = 0; i < 500; i++) {
				Room randomRoom = rooms.get(random.nextInt(rooms.size())); // Random room
				AppUser randomUser = random.nextBoolean() ? regularUser1 : regularUser2; // Random user

				// Generate random dates for the reservation
				LocalDate startDate;
				LocalDate endDate;
				boolean validDates;
				do {
					validDates = true;
					startDate = LocalDate.now().plusDays(faker.number().numberBetween(1, 365));
					endDate = startDate.plusDays(faker.number().numberBetween(1, 10));

					// Check if these dates overlap with any existing reservation for this room
					if (roomReservationsMap.containsKey(randomRoom)) {
						for (ReservationDates existingDates : roomReservationsMap.get(randomRoom)) {
							if (datesOverlap(existingDates, startDate, endDate)) {
								validDates = false;
								break;
							}
						}
					}
				} while (!validDates); // Keep generating dates until we find a non-overlapping one

				// Create ReservationDates object
				ReservationDates reservationDates = new ReservationDates();
				reservationDates.setStartDate(startDate);
				reservationDates.setEndDate(endDate);
				reservationDates.setAddedDate(LocalDate.now());

				// Create ReservationHistory
				ReservationHistory reservationHistory = new ReservationHistory();
				reservationHistory.setReservationDates(reservationDates);
				reservationHistory.setStatus("Archived"); // Example status
				reservationHistory.setAppUser(randomUser);
				reservationHistory.setRoom(randomRoom);

				// Save to repository
				reservationHistoryRepository.save(reservationHistory);

				// Update the room's reservation list
				roomReservationsMap.computeIfAbsent(randomRoom, k -> new java.util.ArrayList<>()).add(reservationDates);
			}
		};

	}

	private boolean datesOverlap(ReservationDates existingDates, LocalDate newStartDate, LocalDate newEndDate) {
		return (newStartDate.isBefore(existingDates.getEndDate()) && newEndDate.isAfter(existingDates.getStartDate()));
	}

}
