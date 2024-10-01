import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllRoomsPage from './pages/AllRoomsPage';
import SingleRoomPage from './pages/(logged-in)/SingleRoomPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { AllReservationsPage } from './pages/(logged-in)/(admin)/AllReservationsPage';
import  ReservationPage  from './pages/(logged-in)/(user)/ReservationPage';
import { RoomEditPage } from './pages/(logged-in)/(admin)/RoomEditPage';
import { RoomDeletePage } from './pages/(logged-in)/(admin)/RoomDeletePage';
import { PrivateRoute } from './components/PrivateRoute';
import { RoomCreatePage } from './pages/(logged-in)/(admin)/RoomCreatePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AllReservationHistoryPage } from './pages/(logged-in)/(admin)/AllReservationsHistoryPage';
import { ReservationHistoryStatisticsDashboard } from './pages/(logged-in)/(admin)/ReservationHistoryStatisticsDashboard';

const App: React.FC = () => {
  return (
      <Router>
          <Navbar />
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<AllRoomsPage />} />
            <Route path="/rooms" element={<AllRoomsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* PRIVATE ROUTES */}
            <Route element={<PrivateRoute allowedRoles={['USER', 'ADMIN']} />}>
              <Route path="/user-reservations" element={<ReservationPage />} />
              <Route path="/rooms/:id" element={<SingleRoomPage />} /> 
              <Route path="/admin/reservations/edit/" element={<SingleRoomPage />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/reservations" element={<AllReservationsPage />} />
              <Route path="/admin/rooms/:id/edit" element={<RoomEditPage />} />
              <Route path="/admin/rooms/:id/delete" element={<RoomDeletePage />} />
              <Route path="/admin/rooms/add" element={<RoomCreatePage />} />
              <Route path="/admin/reservations/history" element={<AllReservationHistoryPage />} />
              <Route path="/admin/reservations/history-statistics" element={<ReservationHistoryStatisticsDashboard />} />
            </Route>

            {/* NOT FOUND */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
      </Router>
  );
};

export default App;