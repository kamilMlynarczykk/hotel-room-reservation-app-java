import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Spinner, Pagination, Form, Button } from 'react-bootstrap';
import { getReservationHistory } from '../../../services/api/ReservationRequests';
import { ReservationAdminGetModel } from '../../../types/ReservationsAdminGetModel';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export const AllReservationHistoryPage: React.FC = () => {
  const { auth } = useAuth();
  const [reservations, setReservations] = useState<ReservationAdminGetModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [pageInput, setPageInput] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (auth && auth.token) {
          const data = await getReservationHistory(auth.token, currentPage - 1, pageSize);
          setReservations(data.content || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        setError('Failed to load reservation history.');
        console.error('Error fetching reservation history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [auth, auth?.token, currentPage, pageSize]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePageInput = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber)) {
      handlePageChange(pageNumber);
    }
    setPageInput('');
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Max number of page buttons to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

    function handleAllReservationsClick(): void {
        navigate("/admin/reservations")
    }

    function handleHistoryStatisticsClick(): void {
        navigate("/admin/reservations/history-statistics")
    }

  return (
    <Container className="mt-5">
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button style={{maxHeight: '40px'}} variant="secondary" onClick={handleAllReservationsClick}><FaArrowLeft/>  Go to all reservations</Button>
        <h1 className="mb-4">Reservations history</h1>
        <Button style={{maxHeight: '40px'}} variant="secondary" onClick={handleHistoryStatisticsClick}>Go to reservation statistics  <FaArrowRight/></Button>
      </div>
      <Table striped bordered hover style={{ minHeight: '60vh' }}>
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Added Date</th>
            <th>Status</th>
            <th>Room Number</th>
            <th>Username</th>
            <th>Price Per Night</th>
          </tr>
        </thead>
        <tbody style={{ minHeight: "60px", maxHeight: "40px" }}>
          {reservations.length > 0 ? (
            reservations.map(reservation => (
              <tr key={reservation.reservationId}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.startDate}</td>
                <td>{reservation.endDate}</td>
                <td>{reservation.addedDate}</td>
                <td>{reservation.status}</td>
                <td>{reservation.roomNumber}</td>
                <td>{reservation.username}</td>
                <td>${reservation.pricePerNight}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No reservations found.</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div style={{justifyContent: 'center', display: 'flex', marginTop: '20px'}}>
        <Pagination>
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {currentPage > 1 && <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>}
        {currentPage > 3 && <Pagination.Ellipsis />}
        {renderPageNumbers().map(pageNumber => (
          <Pagination.Item style={{minWidth: "45px", textAlign: "center"}}
            key={pageNumber}
            active={pageNumber === currentPage}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ))}
        {totalPages > currentPage + 2 && <Pagination.Ellipsis />}
        {totalPages > 1 && <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
      <Form>
        <Form.Control
          type="number"
          min="1"
          max={totalPages}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          placeholder="Go to page"
          style={{ width: '120px', marginRight: '10px' }}
        />
      </Form>
      <Button onClick={handlePageInput}>Go</Button>
      </div>
      
    </Container>
  );
};

export default AllReservationHistoryPage;
