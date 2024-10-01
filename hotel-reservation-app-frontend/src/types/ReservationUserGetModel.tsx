export interface ReservationUserGetModel {
  startDate: string;
  endDate: string;
  status: string;
  roomNumber: number;
  roomType: string;
  roomId: number;
  photoUrl: string;
  pricePerNight: number;
  reservationId: number;
}