import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Alert, Spinner, Form, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { deleteReservation, getAllUserReservationsByUserId } from '../../../services/api/ReservationRequests';
import { ReservationUserGetModel } from '../../../types/ReservationUserGetModel';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import ConfirmationModal from '../../../components/ConfirmationModal';

const ReservationPage: React.FC = () => {
  const { auth } = useAuth();
  const [reservations, setReservations] = useState<ReservationUserGetModel[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<ReservationUserGetModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState<number | null>(null);

  // State for dropdown filters
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');

  // Extract unique values for filters
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);

  // Sorting state
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('');

  // Create a ref for the container
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchReservations = async () => {
      try {
        if (auth?.id) {
          const reservationsData = await getAllUserReservationsByUserId(auth.id);
          setReservations(reservationsData);
          setFilteredReservations(reservationsData);

          // Extract unique values
          const uniqueRoomNumbers = Array.from(new Set(reservationsData.map(reservation => reservation.roomNumber.toString())));
          const uniqueStatuses = Array.from(new Set(reservationsData.map(reservation => reservation.status)));
          const uniqueRoomTypes = Array.from(new Set(reservationsData.map(reservation => reservation.roomType)));

          setRoomNumbers(uniqueRoomNumbers);
          setStatuses(uniqueStatuses);
          setRoomTypes(uniqueRoomTypes);
          ScrollBottom();
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
  }, [auth?.id]);

  const ScrollBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  } // Update when filteredReservations change

  // Filter reservations based on selected values
  useEffect(() => {
    let filtered = reservations;

    if (selectedRoomNumber) {
      filtered = filtered.filter(reservation => reservation.roomNumber.toString() === selectedRoomNumber);
    }

    if (selectedStatus) {
      filtered = filtered.filter(reservation => reservation.status === selectedStatus);
    }

    if (selectedRoomType) {
      filtered = filtered.filter(reservation => reservation.roomType === selectedRoomType);
    }

    setFilteredReservations(filtered);
  }, [selectedRoomNumber, selectedStatus, selectedRoomType, reservations]);

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
        return 'var(--pending-color)';
      case 'Accepted':
        return 'var(--accepted-color)';
      case 'Denied':
        return 'var(--denied-color)';
      case 'Archived':
        return 'var(--archived-color)';
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
          bValue = new Date(b.startDate).getTime();
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const handleConfirmDelete = async () => {
    try {
      if (currentReservationId){
        await deleteReservation(currentReservationId, auth?.token);
        fetchReservations(); // Refresh the reservations list after deletion
      }
      } catch (err: any) {
        const backendError = err.response?.data?.message || 'Failed to delete reservation.';
        setError(backendError);
        console.error(err);
      }
    
    setShowModal(false);
  }

  const handleDeleteClick = (reservationId: number) => {
    setCurrentReservationId(reservationId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="mt-5" ref={containerRef}>
      <ConfirmationModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      <h1 className="mb-4">My Reservations</h1>

      {/* Filters */}
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
          <Form.Group controlId="formRoomType">
            <Form.Label>Room Type</Form.Label>
            <Form.Control as="select" value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)}>
              <option value="">All Room Types</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Table */}
      <Table  style={{ textAlign: "center", verticalAlign: "middle", fontSize: "20px", borderRadius: "50%" }}>
        <thead >
          <tr>
            <th>Photo</th>
            <th>Room Number</th>
            <th onClick={() => sortReservations('startDate')}>
              Start Date {sortColumn === 'startDate' ? (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : ''}
            </th>
            <th onClick={() => sortReservations('endDate')}>
              End Date {sortColumn === 'endDate' ? (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : ''}
            </th>
            <th>Room Type</th>
            <th onClick={() => sortReservations('price')}>
              Price {sortColumn === 'price' ? (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />) : ''}
            </th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr>
              <td>
                {reservation.photoUrl ? (
                  <img src={reservation.photoUrl} alt={`Room ${reservation.roomNumber}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                ) : (
                  'No Photo'
                )}
              </td>
              <td>{reservation.roomNumber}</td>
              <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
              <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
              <td>{reservation.roomType}</td>
              <td>${calculatePrice(reservation.startDate, reservation.endDate, reservation.pricePerNight).toFixed(2)}</td>
              <td style={{ color: getStatusColor(reservation.status) }}>{reservation.status}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(reservation.reservationId)}
                  style={{ borderRadius: '10px', width: '100%' }}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReservationPage;

