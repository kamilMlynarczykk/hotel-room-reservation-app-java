import api, { useSetupAxios } from './apiAddress';
import { Room } from '../../types/Room';

export const getAllRooms = async (): Promise<Room[]> => {
  const response = await api.get<Room[]>('api/rooms');
  return response.data;
};

export const getRoomById = async (id: number, token: string | undefined): Promise<Room> => {
  const response = await api.get<Room>(`api/user/rooms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateRoom = async (room: Room, token: string | undefined): Promise<void> => {
  await api.put<Room>(`api/admin/rooms/${room.id}/edit`, room, {
    headers: { Authorization: `Bearer ${token}`},
  });
}

export const deleteRoom = async (roomId: number, token: string | undefined) => {
  await api.delete<void>(`api/admin/rooms/${roomId}/delete`, {
    headers: { Authorization: `Bearer ${token}`},
  })
}

export const createRoom = async (room: Room, token: string | undefined) => {
  console.log(room)
  await api.post<Room>(`api/admin/rooms/add`, room, {
    headers: { Authorization: `Bearer ${token}`},
  })
}

export const filterRoomsByDateRange = async (startDate: Date, endDate: Date): Promise<Room[]> => {
  const result = await api.get(`/api/rooms?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`)
  return result.data;
};
