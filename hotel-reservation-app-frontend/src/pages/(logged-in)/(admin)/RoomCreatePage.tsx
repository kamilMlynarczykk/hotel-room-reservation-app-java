import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../../services/api/RoomRequests';
import { Container, Button, Alert, Row, Col, Card, Form } from 'react-bootstrap';
import '../../../App.css';
import { faBed, faChair, faFan, faMugHot, faTable, faTv, faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../hooks/useAuth';

export const RoomCreatePage: React.FC = () => {
  const { auth } = useAuth();
  const [roomNumber, setRoomNumber] = useState<number | ''>('');
  const [roomType, setRoomType] = useState<string | ''>('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [pricePerNight, setPricePerNight] = useState<number | ''>('');
  const [chairs, setChairs] = useState<number | ''>('');
  const [beds, setBeds] = useState<number | ''>('');
  const [desks, setDesks] = useState<number | ''>('');
  const [balconies, setBalconies] = useState<number | ''>('');
  const [tvs, setTvs] = useState<number | ''>('');
  const [fridges, setFridges] = useState<number | ''>('');
  const [kettles, setKettles] = useState<number | ''>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomNumber || !roomType || !capacity || !pricePerNight) {
      setError('Please fill in all required fields.');
      return;
    }

    if (Number(pricePerNight) < 0 || isNaN(Number(pricePerNight))) {
      setError('Price per night must be a non-negative number.');
      return;
    }

    if (Number(capacity) < 0 || isNaN(Number(capacity))) {
      setError('Capacity must be a non-negative number.');
      return;
    }

    if (
      Number(chairs) < 0 || isNaN(Number(chairs)) ||
      Number(beds) < 0 || isNaN(Number(beds)) ||
      Number(desks) < 0 || isNaN(Number(desks)) ||
      Number(balconies) < 0 || isNaN(Number(balconies)) ||
      Number(tvs) < 0 || isNaN(Number(tvs)) ||
      Number(fridges) < 0 || isNaN(Number(fridges)) ||
      Number(kettles) < 0 || isNaN(Number(kettles))
    ) {
      setError('Room content fields must be non-negative numbers.');
      return;
    }

    try {
      if (auth && auth.token)
        await createRoom({
          roomNumber: roomNumber,
          roomType,
          capacity: capacity,
          pricePerNight: pricePerNight,
          roomContent: {
            chairs: Number(chairs) || 0,
            beds: Number(beds) || 0,
            desks: Number(desks) || 0,
            balconies: Number(balconies) || 0,
            tvs: Number(tvs) || 0,
            fridges: Number(fridges) || 0,
            kettles: Number(kettles) || 0,
          },
          photoUrl
        }, auth.token);
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate('/rooms'); // Redirect to room list after creation
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create room. Please try again.';
      setError(errorMessage);
      setSuccess(false);
      console.error('Error creating room:', errorMessage);
    }
  };

  const handleCancel = () => {
    navigate('/rooms'); // Redirect back to the room list page
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string); // Set photo URL as the base64 encoded string
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className="page-container">
      <Container className="content-container">
        <Row className="mt-5 justify-content-center">
          <Col md={8} className="d-flex">
            <Card className="flex-fill" style={{ border: '1px solid', borderColor: 'gray', borderRadius: '30px' }}>
              <Card.Body>
                <Card.Title className="text-center">
                  Create a New Room
                </Card.Title>
                <Form>
                  <Row>
                    {/* Left Column */}
                    <Col md={6}>
                      <Form.Group controlId="roomNumber" className="mb-3">
                        <Form.Label>Room Number</Form.Label>
                        <Form.Control type="number" min="0" value={roomNumber} onChange={e => setRoomNumber(Number(e.target.value))} placeholder="Enter room number" />
                      </Form.Group>

                      <Form.Group controlId="roomType" className="mb-3">
                        <Form.Label>Room Type</Form.Label>
                        <Form.Control as="select" value={roomType} onChange={e => setRoomType(e.target.value)}>
                          <option value="">Select room type</option>
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="suite">Suite</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="capacity" className="mb-3">
                        <Form.Label>Capacity</Form.Label>
                        <Form.Control type="number" min="0" value={capacity} onChange={e => setCapacity(Number(e.target.value))} placeholder="Enter capacity" />
                      </Form.Group>

                      <Form.Group controlId="pricePerNight" className="mb-3">
                        <Form.Label>Price per Night</Form.Label>
                        <Form.Control type="number" min="0" value={pricePerNight} onChange={e => setPricePerNight(Number(e.target.value))} placeholder="Enter price per night" />
                      </Form.Group>

                      <Form.Group controlId="photoUrl" className="mb-3">
                        <Form.Label>Photo</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                      </Form.Group>
                    </Col>

                    {/* Right Column */}
                    <Col md={6}>
                      <Form.Group controlId="chairs" className="mb-3">
                        <Form.Label><FontAwesomeIcon icon={faChair} /> Chairs</Form.Label>
                        <Form.Control type="number" min="0" value={chairs} onChange={e => setChairs(Number(e.target.value))} placeholder="Enter number of chairs" />
                      </Form.Group>

                      <Form.Group controlId="beds" className="mb-3">
                        <Form.Label><FontAwesomeIcon icon={faBed} /> Beds</Form.Label>
                        <Form.Control type="number" min="0" value={beds} onChange={e => setBeds(Number(e.target.value))} placeholder="Enter number of beds" />
                      </Form.Group>

                      <Form.Group controlId="desks" className="mb-3">
                        <Form.Label><FontAwesomeIcon icon={faTable} /> Desks</Form.Label>
                        <Form.Control type="number" min="0" value={desks} onChange={e => setDesks(Number(e.target.value))} placeholder="Enter number of desks" />
                      </Form.Group>

                      <Form.Group controlId="balconies" className="mb-3">
                        <Form.Label><FontAwesomeIcon icon={faUmbrellaBeach} /> Balconies</Form.Label>
                        <Form.Control type="number" min="0" value={balconies} onChange={e => setBalconies(Number(e.target.value))} placeholder="Enter number of balconies" />
                      </Form.Group>

                      <Form.Group controlId="tvs" className="mb-3">
                        <Form.Label><FontAwesomeIcon icon={faTv} /> TVs</Form.Label>
                        <Form.Control type="number" min="0" value={tvs} onChange={e => setTvs(Number(e.target.value))} placeholder="Enter number of TVs" />
                      </Form.Group>

                      <Form.Group controlId="fridges" className="mb-3">
                        <Form.Label><FontAwesomeIcon icon={faFan} /> Fridges</Form.Label>
                        <Form.Control type="number" min="0" value={fridges} onChange={e => setFridges(Number(e.target.value))} placeholder="Enter number of fridges" />
                      </Form.Group>

                      <Form.Group controlId="kettles" className="mb-3">
                        <Form.Label><FontAwesomeIcon icon={faMugHot} /> Kettles</Form.Label>
                        <Form.Control type="number" min="0" value={kettles} onChange={e => setKettles(Number(e.target.value))} placeholder="Enter number of kettles" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingTop: '20px' }}>
                    <Button variant="primary" onClick={handleCreateRoom} style={{ borderRadius: '30px', width: '45%', fontSize: '18px', padding: '10px' }}>
                      Create Room
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} style={{ borderRadius: '30px', width: '45%', fontSize: '18px', padding: '10px' }}>
                      Cancel
                    </Button>
                  </div>
                </Form>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3">Room created successfully!</Alert>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RoomCreatePage;
