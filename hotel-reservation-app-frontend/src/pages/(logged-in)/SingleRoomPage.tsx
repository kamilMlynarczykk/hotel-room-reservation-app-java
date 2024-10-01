import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getRoomById } from '../../services/api/RoomRequests';
import { Room } from '../../types/Room';
import { Container, Button, Collapse, Alert, Row, Col, Card } from 'react-bootstrap';
import { useSetupAxios } from '../../services/api/apiAddress';
import '../../css/SingleRoomPage.css';
import '../../App.css';
import { getAvailableDates, postReservation } from '../../services/api/ReservationRequests';
import { useAuth } from '../../hooks/useAuth';
import { AvailableDates } from '../../types/AvailableDates';
import { faArrowDown, faArrowUp, faChair, faBed, faTable, faTv, faFan, faUmbrellaBeach, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SingleRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [showReserve, setShowReserve] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [availableDates, setAvailableDates] = useState<{ startDate: string; endDate: string }[]>([]);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [datesLocked, setDatesLocked] = useState(false);
  const [nextMonthDate, setNextMonthDate] = useState<Date | null>(null);

  const navigate = useNavigate();
  useSetupAxios();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if(auth && auth.token){
          const roomData = await getRoomById(Number(id), auth.token);
          setRoom(roomData);
        } 
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchRoom();
  }, [id]);

  const fetchAvailableDates = async (roomId: number) => {
    try {
      const response: AvailableDates = await getAvailableDates(roomId);
      setAvailableDates(response);
    } catch (error: any) {
      console.error('Error fetching available dates:', error);
      setError('Failed to fetch available dates. Please try again.');
    }
  };

  useEffect(() => {
    if (showReserve) fetchAvailableDates(Number(id));
  }, [showReserve, id]);

  const handleReserveClick = () => {
    setShowReserve(!showReserve);
    setSuccess(false);
    setError(null);
  };

  const handleReservationSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      await postReservation(
        {
          startDate: new Date((startDate.getTime() + (24 * 60 * 60 * 1000))).toISOString().split('T')[0],
          endDate: new Date((endDate.getTime() + (24 * 60 * 60 * 1000))).toISOString().split('T')[0],
          addedDate: new Date().toISOString().split('T')[0]
        },
        'Pending',
        Number(auth?.id),
        Number(id)
      );
      setSuccess(true);
      setError(null);

      setTimeout(() => {
        navigate('/user-reservations');
      }, 2000);
      if (!success) fetchAvailableDates(Number(id));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create reservation. Please try again.';
      setError(errorMessage);
      setSuccess(false);
      console.error('Error creating reservation:', errorMessage);
    }
  };

  const getHighlightedDates = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setStartDate(endDate);
        setEndDate(null);
        return [];
      }
      const highlightedDates = [];
      let current = new Date(startDate);
      while (current <= endDate) {
        highlightedDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return highlightedDates;
    }
    return [];
  };

  const highlightWithRanges = () => {
    const allStartDates = new Set<number>();
    const allEndDates = new Set<number>();
    const allDates = new Set<number>();
    const fullyReserved = new Set<Date>();
    const borderDates = new Set<Date>();

    availableDates.forEach(({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);

      allStartDates.add(start.getTime());
      allEndDates.add(end.getTime());

      let current = new Date(startDate);
      while (current <= end) {
        allDates.add(current.getTime());
        current.setDate(current.getDate() + 1);
      }
    });

    allDates.forEach(timestamp => {
      const date = new Date(timestamp);

      const isFullyReserved = availableDates.some(({ startDate, endDate }) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return timestamp > start && timestamp < end;
      });

      if ((allStartDates.has(timestamp) && allEndDates.has(timestamp)) || isFullyReserved) {
        fullyReserved.add(date);
      } else {
        if (allStartDates.has(timestamp) || allEndDates.has(timestamp)) {
          borderDates.add(date);
        }
      }
    });

    return {
      fullyReserved: Array.from(fullyReserved),
      borderDates: Array.from(borderDates),
      highlightedDates: getHighlightedDates()
    };
  };

  const isDateDisabled = (date: Date) => {
    return fullyReserved.some(reservedDate =>
      reservedDate.toDateString() === date.toDateString()
    );
  };

  const { fullyReserved, borderDates, highlightedDates } = highlightWithRanges();

  const handleResetDates = () => {
    setStartDate(null);
    setEndDate(null);
    setDatesLocked(false);
  };

  function handleEditClick(roomId: number): void {
    navigate(`/admin/rooms/${roomId}/edit`);
  }

  function handleDeleteClick(roomId: number): void {
    navigate(`/admin/rooms/${roomId}/delete`);
  }

  return (
    <div className="page-container">
      <Container className="content-container">
        <Row>
          <Col md={6} className="d-flex">
            <Card className="flex-fill" style={{ border: '1px solid', borderColor: 'gray', borderRadius: '30px' }}>
              <Card.Img
                variant="top"
                src={"../" + room?.photoUrl}
                alt={`Room ${room?.roomNumber}`}
                className="img-fluid"
                style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }}
              />
              <Card.Body>
                <Card.Title className="text-center">
                  Room {room?.roomNumber} - {room?.roomType}
                </Card.Title>
                <Card.Text>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Capacity:</strong>
                    <span>{room?.capacity}</span>
                  </p>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Price per Night:</strong>
                    <span>${room?.pricePerNight}</span>
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="d-flex">
            <Card className="flex-fill" style={{ border: '1px solid', borderColor: 'gray', borderRadius: '30px' }}>
              <Card.Body>
                <Card.Title className="text-center">
                  Room Includes:
                </Card.Title>
                <Card.Text className='text-center'>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0' }}><FontAwesomeIcon icon={faChair} /> Chairs: {room?.roomContent.chairs}</p>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0' }}><FontAwesomeIcon icon={faBed} /> Beds: {room?.roomContent.beds}</p>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0' }}><FontAwesomeIcon icon={faTable} /> Desks: {room?.roomContent.desks}</p>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0' }}><FontAwesomeIcon icon={faUmbrellaBeach} /> Balconies: {room?.roomContent.balconies}</p>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0' }}><FontAwesomeIcon icon={faTv} /> TVs: {room?.roomContent.tvs}</p>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0' }}><FontAwesomeIcon icon={faFan} /> Fridges: {room?.roomContent.fridges}</p>
                  <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0' }}><FontAwesomeIcon icon={faMugHot} /> Kettles: {room?.roomContent.kettles}</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        { auth?.roles.includes("ADMIN") ? (
            <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '20px'}}>
                    <Button
                    variant="warning"
                    onClick={() => handleEditClick(Number(id))}
                    style={{borderRadius: '30px', width:'45%'}}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(Number(id))}
                    style={{borderRadius: '30px',width:'45%'}}
                  >
                    Delete
                  </Button>
                  </div>
        ) : (
          <Row className="mt-5 justify-content-center">
          <Col md={6} className="text-center" style={{width : '100%'}}>
            <Button variant="secondary" onClick={handleReserveClick} className="btn-lg mt-3"
              style={{ width: '100%', height: "50px", borderRadius: "30px" }}>
              {!showReserve ? (
                <span>Reserve Now <FontAwesomeIcon icon={faArrowDown} /></span>
              ) : (
                <span>Reserve Now <FontAwesomeIcon icon={faArrowUp} /></span>
              )}
            </Button>
            <Collapse in={showReserve}>
              <div className="mt-3">
                <h4>Select Reservation Dates:</h4>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                  <DatePicker
                    title={isSelectingStartDate ? 'Start Date' : 'End Date'}
                    selected={isSelectingStartDate ? startDate : endDate}
                    onChange={(date) => {
                      if (datesLocked) return; // Prevent date changes if dates are locked
                      if (isSelectingStartDate) {
                        if (endDate && date && date > endDate) {
                          setEndDate(null);
                        }
                        setStartDate(date);
                        setIsSelectingStartDate(false);
                        setEndDate(null);
                      } else {
                        if (startDate && date && date < startDate) {
                          setStartDate(date);
                          setEndDate(null);
                        } else {
                          setEndDate(date);
                          setDatesLocked(true);
                        }
                        setIsSelectingStartDate(true);
                      }
                    }}
                    minDate={new Date()}
                    filterDate={(date) => !isDateDisabled(date)}
                    highlightDates={[
                      { 'react-datepicker__day--highlight-reserved': fullyReserved },
                      { 'react-datepicker__day--highlight-border': borderDates },
                      { 'react-datepicker__day--highlighted-range': highlightedDates },
                    ]}
                    inline
                  />
                </div>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                  <Button variant="success" onClick={handleReservationSubmit} className="mt-3">
                    Submit Reservation
                  </Button>
                  <Button variant="warning" onClick={handleResetDates} className="mt-3">
                    Reset Dates
                  </Button>
                </div>
                
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3">Reservation created successfully!</Alert>}
              </div>
            </Collapse>
          </Col>
        </Row>
        )
        }
        
      </Container>
    </div>
  );
};

export default SingleRoomPage;
