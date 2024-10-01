import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoomById, updateRoom } from '../../../services/api/RoomRequests'; // Adjust path as needed
import { RoomContent } from '../../../types/RoomContent';
import { Room } from '../../../types/Room';
import { useAuth } from '../../../hooks/useAuth';
 // Import your CSS file for custom styling if any

// Define union type for RoomContent keys
type RoomContentKeys = 'chairs' | 'beds' | 'desks' | 'balconies' | 'tvs' | 'fridges' | 'kettles';

export const RoomEditPage: React.FC = () => {
  const { auth } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Room>>({
    roomNumber: 0,
    roomType: '',
    pricePerNight: 0,
    photoUrl: '',
    capacity: 0,
    roomContent: {
      chairs: 0,
      beds: 0,
      desks: 0,
      balconies: 0,
      tvs: 0,
      fridges: 0,
      kettles: 0,
    } as RoomContent // Ensure this matches RoomContent
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (id && auth && auth.token) {
          const roomData = await getRoomById(Number(id), auth.token);
          setRoom(roomData);
          setFormData({
            roomNumber: roomData.roomNumber,
            roomType: roomData.roomType,
            pricePerNight: roomData.pricePerNight,
            photoUrl: roomData.photoUrl,
            capacity: roomData.capacity,
            roomContent: roomData.roomContent
          });
        }
      } catch (err) {
        setError('Failed to fetch room details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, auth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as RoomContentKeys; // Assert the key to the specific type
    const newValue = parseInt(value, 10) || 0; // Default to 0 if parsing fails
    setFormData(prev => ({
      ...prev,
      roomContent: {
        ...prev.roomContent,
        [key]: newValue
      } as RoomContent // Ensure this matches RoomContent
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) { // Ensure `id` is defined
        try {
            const updatedRoom: Room = {
                id: Number(id), // Ensure `id` is a number and not undefined
                roomNumber: formData.roomNumber || 0,
                roomType: formData.roomType || '',
                pricePerNight: formData.pricePerNight || 0,
                photoUrl: photoFile ? URL.createObjectURL(photoFile) : formData.photoUrl || '',
                capacity: formData.capacity || 0,
                roomContent: formData.roomContent || {
                    chairs: 0,
                    beds: 0,
                    desks: 0,
                    balconies: 0,
                    tvs: 0,
                    fridges: 0,
                    kettles: 0
                }
                // Add other required fields for Room if necessary
            };
            await updateRoom(updatedRoom, auth?.token); // Assuming updateRoom function expects `Room`
            navigate(`/rooms/${id}`);
        } catch (err) {
            setError('Failed to update room.');
            console.error(err);
        }
    }
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

  return (
    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Card style={{ border: '1px solid', borderColor: 'gray', borderRadius: '30px' }}>
            <Card.Body>
              <h1 className="text-center">Edit Room</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRoomNumber">
                  <Form.Label>Room Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formRoomType">
                  <Form.Label>Room Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formPricePerNight">
                  <Form.Label>Price Per Night</Form.Label>
                  <Form.Control
                    type="text"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formCapacity">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formRoomContent">
                  <Form.Label>Room Content</Form.Label>
                  <Row>
                    {['chairs', 'beds', 'desks', 'balconies', 'tvs', 'fridges', 'kettles'].map((item, index) => (
                      <Col key={index} md={4}>
                        <Form.Group controlId={`form${item.charAt(0).toUpperCase() + item.slice(1)}`}>
                          <Form.Label>{item.charAt(0).toUpperCase() + item.slice(1)}</Form.Label>
                          <Form.Control
                            type="number"
                            name={item}
                            value={formData.roomContent?.[item] || 0}
                            onChange={handleRoomContentChange}
                          />
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
                <Form.Group controlId="formPhotoUrl">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {room?.photoUrl && (
                    <img src={"../../../" + room?.photoUrl} alt="Room" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />
                  )}
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3" style={{ borderRadius: '30px', width: '100%' }}>
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
