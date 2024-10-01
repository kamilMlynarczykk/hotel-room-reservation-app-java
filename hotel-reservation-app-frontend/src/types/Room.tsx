import { RoomContent } from "./RoomContent";

export interface Room {
  id?: number;
  roomNumber: number;
  roomType: string;
  pricePerNight: number;
  photoUrl: string;
  roomContent: RoomContent;
  capacity: number;
}