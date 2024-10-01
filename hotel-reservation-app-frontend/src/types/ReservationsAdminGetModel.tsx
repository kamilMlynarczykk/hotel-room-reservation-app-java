export interface ReservationAdminGetModel {
  reservationId: number;
  startDate: string;
  endDate: string;
  addedDate: string;
  status: string;
  roomNumber: number;
  username: string;
  photoUrl: string;
  pricePerNight: number;
  roomId: number;
}