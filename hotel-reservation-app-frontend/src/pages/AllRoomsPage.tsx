import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { getAllRooms, filterRoomsByDateRange } from '../services/api/RoomRequests'; // Ensure this function exists
import { Room } from '../types/Room';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const RoomsPage: React.FC = () => {
  const { auth } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setRooms(data);
        setFilteredRooms(data); // Initialize filteredRooms with all rooms
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchFilteredRooms = async () => {
      if (startDate && endDate) {
        try {
          const data = await filterRoomsByDateRange(startDate, endDate);
          setFilteredRooms(data);
        } catch (error) {
          console.error('Error filtering rooms:', error);
        }
      } else {
        setFilteredRooms(rooms);
      }
    };

    fetchFilteredRooms();
  }, [startDate, endDate, rooms]);

  const handleReserveClick = (roomId: number | undefined) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleEditClick = (roomId: number | undefined) => {
    navigate(`/admin/rooms/${roomId}/edit`);
  };

  const handleDeleteClick = (roomId: number | undefined) => {
    navigate(`/admin/rooms/${roomId}/delete`);
  };

  const handleClearClick = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredRooms(rooms);
  };

  const handleAddClick = () => {
    navigate('/admin/rooms/add');
  };

  return (
    <Container className='text-center' style={{ paddingTop: "20px" }}>
      {auth?.roles.includes('ADMIN') && (
        <Button
          variant="primary"
          onClick={() => handleAddClick()}
          style={{ borderRadius: '30px', width: '45%' }}
        >
          Add a room
        </Button>
      )}
      <h1 className="my-4 text-center">Available Rooms</h1>
      <div className="mb-4">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date || undefined)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select start date"
            className="form-control"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date || undefined)}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select end date"
            className="form-control"
            isClearable
            minDate={startDate}
          />
          <Button
            variant="primary"
            onClick={handleClearClick}
            style={{ borderRadius: '10px', width: '10%' }}
          >
            Clear
          </Button>
        </div>
      </div>
      {filteredRooms.length > 0 ? (
        <Row>
          {filteredRooms.map((room) => (
            <Col key={room.id} sm={12} md={6} lg={4} className="mb-4">
              <Card style={{ border: '1px solid', borderColor: 'gray', borderRadius: '30px' }}>
                <Card.Img
                  variant="top"
                  src={room.photoUrl}
                  alt={`Room ${room.roomNumber}`}
                  className="img-fluid"
                  style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }}
                />
                <Card.Body>
                  <Card.Title className="text-center">
                    Room {room.roomNumber} - {room.roomType}
                  </Card.Title>
                  <Card.Text>
                    <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Capacity:</strong>
                      <span>{room.capacity}</span>
                    </p>
                    <p style={{ borderBottom: '1px solid #ccc', padding: '8px', margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Price per Night:</strong>
                      <span>${room.pricePerNight}</span>
                    </p>
                  </Card.Text>
                  {auth?.roles.includes("ADMIN") ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="warning"
                        onClick={() => handleEditClick(room.id)}
                        style={{ borderRadius: '30px', width: '45%' }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(room.id)}
                        style={{ borderRadius: '30px', width: '45%' }}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="d-grid">
                      <Button
                        variant="primary"
                        onClick={() => handleReserveClick(room.id)}
                        style={{ borderRadius: '30px' }}
                      >
                        Reserve
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <h1 className='text-center'>No rooms available</h1>
      )}
    </Container>
  );
};

export default RoomsPage;
