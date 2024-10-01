import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this reservation? This action cannot be undone.</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          No, don't delete
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Yes, delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
