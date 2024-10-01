import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import 'bootstrap/dist/css/bootstrap.min.css';

export const NotFoundPage = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to navigate back to the home page or another relevant route
  const goHome = () => {
    navigate('/'); // Adjust the path as needed, e.g., '/rooms'
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="display-3 text-danger">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-muted mb-4">
        Sorry, the page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <button className="btn btn-primary" onClick={goHome}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
