import api, { useSetupAxios } from './apiAddress';
import { AvailableDates } from '../../types/AvailableDates';
import { ReservationUserGetModel } from '../../types/ReservationUserGetModel';
import { ReservationAdminGetModel } from '../../types/ReservationsAdminGetModel';
import { ReservationHistoryStatisticsModel } from '../../types/ReservationHistoryStatisticsModel';

export const getReservationById = async (id: String): Promise<ReservationAdminGetModel> => {
    const response = await api.get<ReservationAdminGetModel>(`api/admin/reservations/${id}`);
    return response.data;
}

export const getAllUserReservationsByUserId = async (userId: number): Promise<ReservationUserGetModel[]> => {
    // Retrieve the token from local storage or another secure location
        const token = localStorage.getItem('token'); // Or use another method to retrieve the token

        // Perform the API request with the Authorization header
        const response = await api.get<ReservationUserGetModel[]>(`/api/user/${userId}/reservations`, {
            headers: {
                'Authorization': `Bearer ${token}` // Set the Authorization header
            }
        });

        console.log(response.data); // For debugging purposes
        return response.data;
}

export const getAllReservations = async (): Promise<ReservationAdminGetModel[]> => {
    // Retrieve the token from local storage or another secure location
        const token = localStorage.getItem('token'); // Or use another method to retrieve the token

        // Perform the API request with the Authorization header
        const response = await api.get<ReservationAdminGetModel[]>(`/api/admin/reservations`, {
            headers: {
                'Authorization': `Bearer ${token}` // Set the Authorization header
            }
        });

        console.log(response.data); // For debugging purposes
        return response.data;
}

export const getAvailableDates = async (roomId: number): Promise<AvailableDates> => {
  try {
    const response = await api.get(`/api/user/reservations/${roomId}/reserved-dates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    throw error;
  }
};

export const postReservation = async (
  reservationDates: { startDate: string; endDate: string; addedDate: string },
  status: string,
  appUserId: number,
  roomId: number
): Promise<{ status: number }> => {
  try {
    const response = await api.post(
      '/api/user/reservations',
      {
        appUserId,
        roomId,
        reservationDates,
        status,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return { status: response.status };
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      // Re-throw the error with the specific message from the server
      throw new Error(error.response.data.message);
    } else {
      // Re-throw a generic error if no specific message is provided
      throw new Error('Failed to create reservation. Please try again later.');
    }
  }
};

export const updateReservation = async (
  id: number,
  startDate: string,
  endDate: string,
  token: string | undefined
): Promise<void> => {
  if (!token) throw new Error('Unauthorized');
  await api.put(`/api/admin/reservations/${id}`, {startDate, endDate}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateReservationStatus = async (
  id: number,
  status: string,
  token: string | undefined
): Promise<void> => {
  console.log(status)
  if (!token) throw new Error('Unauthorized');
  await api.put(`/api/admin/reservations/${id}/status`, {status}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteReservation = async (reservationId: number, token: string | undefined) => {
  await api.delete<void>(`api/admin/reservations/${reservationId}/delete`, {
    headers: { Authorization: `Bearer ${token}`},
  })
}

export const deleteReservationUser = async (reservationId: number, token: string | undefined) => {
  await api.delete<void>(`api/user/reservations/${reservationId}/delete`, {
    headers: { Authorization: `Bearer ${token}`},
  })
}


// RESERVATION HISTORY // 

export const getReservationHistory = async (token: string | undefined, page: number, size: number): Promise<{ content: ReservationAdminGetModel[], totalPages: number }> => {
  const response = await api.get<{ content: ReservationAdminGetModel[], totalPages: number }>('api/admin/reservations/history', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size }
  });
  return response.data;
};

export const getReservationHistoryStatistics = async (token: string | undefined): Promise<ReservationHistoryStatisticsModel[]> => {
  const response = await api.get<ReservationHistoryStatisticsModel[]>('api/admin/reservations/history-statistics', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};