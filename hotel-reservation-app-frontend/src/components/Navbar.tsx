import React, { useState, ReactElement } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../context/AuthContext';
import { FaSun, FaMoon, FaHotel } from 'react-icons/fa'; // Import icons from react-icons

const Navbar: React.FC = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.getAttribute('data-bs-theme') === 'dark');
  const { auth, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthProvider>
      <BootstrapNavbar
        expand="lg"
        bg="dark"
        variant="dark"
        style={{
          borderBottom: '2px solid grey', // Adjust the width and color as needed
        }}
      >
        <Container>
          <Button
            id="btnSwitch"
            variant="outline-light"
            className="me-2 d-flex align-items-center"
            onClick={handleThemeToggle}
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </Button>

          <BootstrapNavbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleMenu}
          />
          <BootstrapNavbar.Collapse
            id="basic-navbar-nav"
            className={isOpen ? 'show' : ''}
          >
            <Nav className="me-auto">
              <Nav.Link href="/rooms">Pokoje</Nav.Link>
              {auth ? 
              auth?.roles.includes("ADMIN") ? (
                <Nav.Link href="/admin/reservations">Wszystkie rezerwacje</Nav.Link>
              ) : auth?.roles.includes("USER") ? (
                <Nav.Link href="/user-reservations">Rezerwacje</Nav.Link>
              ) : null: null}
            </Nav>
            <Nav className="ml-auto">
              {auth ? (
                <Button variant="outline-light" onClick={() => logout()}>Wyloguj</Button>
              ) : (
                <>
                  <Nav.Link href="/login">Log in</Nav.Link>
                  <Nav.Link href="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </AuthProvider>
  );
};

export default Navbar;
