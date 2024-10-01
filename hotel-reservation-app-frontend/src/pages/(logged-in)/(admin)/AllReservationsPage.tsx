import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Alert, Spinner, Form, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { ReservationAdminGetModel } from '../../../types/ReservationsAdminGetModel';
import { getAllReservations, updateReservation, updateReservationStatus, deleteReservation } from '../../../services/api/ReservationRequests';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { FaArrowUp, FaArrowDown, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const AllReservationsPage: React.FC = () => {
  const { auth } = useAuth(); // Custom hook to get auth token or user info
  const [reservations, setReservations] = useState<ReservationAdminGetModel[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<ReservationAdminGetModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState<number | null>(null);
  const navigate = useNavigate();

  // State for dropdown filters
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  // Extract unique values for filters
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);

  // Sorting state
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('');

  // Editing state now stores an object with ID, startDate, and endDate
  const [editingReservation, setEditingReservation] = useState<{ roomId: number; startDate: string; endDate: string } | null>(null);
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editEndDate, setEditEndDate] = useState<string>('');

  // Create a ref for the container
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchReservations = async () => {
      try {
        if (auth?.token) {
          const reservationsData = await getAllReservations();
          setReservations(reservationsData);
          setFilteredReservations(reservationsData);

          // Extract unique values
          const uniqueRoomNumbers = Array.from(new Set(reservationsData.map(reservation => reservation.roomNumber.toString())));
          const uniqueStatuses = Array.from(new Set(reservationsData.map(reservation => reservation.status)));
          const uniqueUsernames = Array.from(new Set(reservationsData.map(reservation => reservation.username)));

          setRoomNumbers(uniqueRoomNumbers);
          setStatuses(uniqueStatuses);
          setUsernames(uniqueUsernames);
          scrollBottom();
        }
      } catch (err) {
        setError('Failed to fetch reservations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchReservations();
  }, [auth?.token]);


  const scrollBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // Filter reservations based on selected values
  useEffect(() => {
    let filtered = reservations;

    if (selectedRoomNumber) {
      filtered = filtered.filter(reservation => reservation.roomNumber.toString() === selectedRoomNumber);
    }

    if (selectedStatus) {
      filtered = filtered.filter(reservation => reservation.status === selectedStatus);
    }

    if (selectedUsername) {
      filtered = filtered.filter(reservation => reservation.username === selectedUsername);
    }

    setFilteredReservations(filtered);
  }, [selectedRoomNumber, selectedStatus, selectedUsername, reservations]);

  // Function to calculate the total price
  const calculatePrice = (startDate: string, endDate: string, pricePerNight: number) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return numberOfNights * pricePerNight;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Accepted':
        return 'green';
      case 'Denied':
        return 'red';
      case 'Archived':
        return 'gray';
      default:
        return '#000'; // Default color if status is not matched
    }
  };

  const sortReservations = (column: string) => {
    const direction = sortColumn === column ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortDirection(direction);
    setSortColumn(column);

    const sorted = [...filteredReservations].sort((a, b) => {
      let aValue, bValue;

      switch (column) {
        case 'startDate':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
        case 'endDate':
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
        case 'price':
          aValue = calculatePrice(a.startDate, a.endDate, a.pricePerNight);
          bValue = calculatePrice(b.startDate, b.endDate, b.pricePerNight);
          break;
        default:
          return 0;
      }

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredReservations(sorted);
  };

  // Handle Edit
  const handleEditClick = (reservation: ReservationAdminGetModel) => {
    setEditingReservation({
      roomId: reservation.roomId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
    });
    setEditStartDate(reservation.startDate);
    setEditEndDate(reservation.endDate);
  };

  const handleAcceptClick = async (reservationId: number) => {
    try {
      await updateReservationStatus(reservationId, 'Accepted', auth?.token);
      fetchReservations();
  } catch (err: any) {
      const backendError = err.response?.data?.message || 'Failed to update reservation status.';
      setError(backendError);
      console.error(err);
    }
  };

  const handleDeleteClick = (reservationId: number) => {
    setCurrentReservationId(reservationId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (currentReservationId !== null) {
      try {
        await deleteReservation(currentReservationId, auth?.token);
        fetchReservations(); // Refresh the reservations list after deletion
      } catch (err: any) {
        const backendError = err.response?.data?.message || 'Failed to delete reservation.';
        setError(backendError);
        console.error(err);
      }
    }
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const handleCancelEdit = () => {
    setEditingReservation(null);
  };

  const handleSaveEdit = async (reservationId: number) => {
    try {
      await updateReservation(reservationId, editStartDate, editEndDate, auth?.token);
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.roomId === reservationId && reservation.startDate === editStartDate && reservation.endDate === editEndDate
            ? { ...reservation, startDate: editStartDate, endDate: editEndDate }
            : reservation
        )
      );
      setEditingReservation(null);
      setError(null); // Clear previous errors on success
      fetchReservations();
    } catch (err: any) {
      const backendError = err.response?.data?.message || 'Failed to update reservation dates.';
      setError(backendError);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const handleHistoryClick = () => {
    navigate('/admin/reservations/history');
  }

  const handleRservationStatisticsClick = () => {
    navigate('/admin/reservations/history-statistics');
  }

  return (
    <Container className="mt-5" ref={containerRef}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button style={{maxHeight: '40px'}} variant="secondary" onClick={handleRservationStatisticsClick}><FaArrowLeft/>  Reservation history statistics</Button>
        <h1 className="mb-4">All Reservations</h1>
        <Button style={{maxHeight: '40px'}} variant="secondary" onClick={handleHistoryClick}>Reservations history  <FaArrowRight /></Button>
      </div>
      

      {/* Show error if exists */}
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {/* Filters */}
      <ConfirmationModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Form.Group controlId="formRoomNumber">
            <Form.Label>Room Number</Form.Label>
            <Form.Control as="select" value={selectedRoomNumber} onChange={(e) => setSelectedRoomNumber(e.target.value)}>
              <option value="">All Room Numbers</option>
              {roomNumbers.map(number => (
                <option key={number} value={number}>{number}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={4} className="mb-3">
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={4} className="mb-3">
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control as="select" value={selectedUsername} onChange={(e) => setSelectedUsername(e.target.value)}>
              <option value="">All Usernames</option>
              {usernames.map(username => (
                <option key={username} value={username}>{username}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Table */}
      <Table style={{ textAlign: "center", verticalAlign: "middle", fontSize: "20px", borderRadius: "50%" }}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Room Number</th>
            <th onClick={() => sortReservations('startDate')}>
              Start Date {sortColumn === 'startDate' ? (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : ''}
            </th>
            <th onClick={() => sortReservations('endDate')}>
              End Date {sortColumn === 'endDate' ? (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : ''}
            </th>
            <th>Added Date</th>
            <th>Username</th>
            <th onClick={() => sortReservations('price')}>
              Price {sortColumn === 'price' ? (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : ''}
            </th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr key={`${reservation.roomId}-${reservation.startDate}-${reservation.endDate}`}>
              <td>
                {reservation.photoUrl ? (
                  <img src={"../" + reservation.photoUrl} alt={`Room ${reservation.roomNumber}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                ) : (
                  'No Photo'
                )}
              </td>
              <td>{reservation.roomNumber}</td>
              <td>
                {editingReservation &&
                editingReservation.roomId === reservation.roomId &&
                editingReservation.startDate === reservation.startDate &&
                editingReservation.endDate === reservation.endDate ? (
                  <Form.Control type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                ) : (
                  new Date(reservation.startDate).toLocaleDateString()
                )}
              </td>
              <td>
                {editingReservation &&
                editingReservation.roomId === reservation.roomId &&
                editingReservation.startDate === reservation.startDate &&
                editingReservation.endDate === reservation.endDate ? (
                  <Form.Control type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                ) : (
                  new Date(reservation.endDate).toLocaleDateString()
                )}
              </td>
              <td>{reservation.addedDate}</td>
              <td>{reservation.username}</td>
              <td>${calculatePrice(reservation.startDate, reservation.endDate, reservation.pricePerNight).toFixed(2)}</td>
              <td style={{ color: getStatusColor(reservation.status) }}>{reservation.status}</td>
              <td>
                <div style={{width: "100%", display: "grid", justifyContent: "space-between"}}>
                  {editingReservation &&
                  editingReservation.roomId === reservation.roomId &&
                  editingReservation.startDate === reservation.startDate &&
                  editingReservation.endDate === reservation.endDate ? (
                    <>
                      <Button variant="success" onClick={() => handleSaveEdit(reservation.reservationId)}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" onClick={() => handleEditClick(reservation)}>
                      Edit
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => (handleDeleteClick(reservation.reservationId))}>
                    Delete
                  </Button>
                  <Button variant="success" onClick={() => handleAcceptClick(reservation.reservationId)}>
                    Accept
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
