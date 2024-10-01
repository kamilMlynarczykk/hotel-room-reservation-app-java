import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoomById, deleteRoom } from '../../../services/api/RoomRequests';
import { Room } from '../../../types/Room';
import { Container, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import '../../../css/RoomDeletePage.css';
import '../../../App.css';
import { faBed, faChair, faFan, faMugHot, faTable, faTv, faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const RoomDeletePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
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
        setError('Failed to fetch room details. Please try again.');
      }
    };

    fetchRoom();
  }, [id, auth]);

  const handleDelete = async () => {
    try {
      if (auth && auth.token) {
        await deleteRoom(Number(id), auth.token);
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          navigate('/rooms'); // Redirect to room list after deletion
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete room. Please try again.';
      setError(errorMessage);
      setSuccess(false);
      console.error('Error deleting room:', errorMessage);
    }
  };

  const handleCancel = () => {
    navigate(`/rooms/${id}`); // Redirect back to the room details page
  };

  return (
    <div className="page-container">
      <Container className="content-container">
        <Row>
          <Col md={6} className="d-flex">
            <Card className="flex-fill" style={{ border: '1px solid', borderColor: 'gray', borderRadius: '30px' }}>
              <Card.Img
                variant="top"
                src={"../../../" + room?.photoUrl}
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
        <Row className="mt-5 justify-content-center">
          <Col md={6} className="text-center">
            <h2>Are you sure you want to delete this room?</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingTop: '20px' }}>
              <Button
                variant="danger"
                onClick={handleDelete}
                style={{ borderRadius: '30px', width: '45%', fontSize: '18px', padding: '10px' }}
              >
                Delete Room
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                style={{ borderRadius: '30px', width: '45%', fontSize: '18px', padding: '10px' }}
              >
                Cancel
              </Button>
            </div>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && <Alert variant="success" className="mt-3">Room deleted successfully!</Alert>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RoomDeletePage;
