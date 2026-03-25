import React from 'react';
import './Header.css';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const token = localStorage.getItem('@App:token');
    const userJson = localStorage.getItem('@App:user');
    const user = userJson ? JSON.parse(userJson) : null;
    const isLoggedIn = !!token;
    const isAdmin = user?.userType === 'ADMIN';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (

        <Navbar expand="lg" className='header' aria-label="Main navigation">
            <Container fluid>
                {/* Lado Esquerdo: Título Original (Brand) */}
                <Navbar.Brand as={Link} to="/">
                    Address Manager
                </Navbar.Brand>

                {/* Botão para Mobile */}
                <Navbar.Toggle aria-controls="navbarContent" />

                <Navbar.Collapse id="navbarContent">
            
                    <Nav className="me-auto mb-2 mb-lg-0">

                        <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
                            Home
                        </Nav.Link>

                       {isLoggedIn && isAdmin && (
                            <Nav.Link as={Link} to="/users" active={location.pathname === '/users'}>
                                Usuários
                            </Nav.Link>
                        )}

                        {isLoggedIn && (
                            <Nav.Link as={Link} to="/myaddresses" active={location.pathname === '/myaddresses'}>
                                Meus Endereços
                            </Nav.Link>
                        )}
                       
                    </Nav>

                    {/* Lado Direito: Ícone de Usuário */}
                    <Nav>
                        <NavDropdown
                            title={
                                <div className="d-inline-flex align-items-center">
                                    <i className="bi bi-person-circle" style={{ fontSize: '1.4rem' }}></i>
                                    {isLoggedIn && <span className="ms-2 d-none d-lg-inline small">{user?.name}</span>}
                                </div>
                            }
                            id="user-dropdown"
                            align="end"
                        >
                            {!isLoggedIn ? (
                                <NavDropdown.Item as={Link} to="/login">
                                    <i className="bi bi-box-arrow-in-right me-2"></i> Entrar
                                </NavDropdown.Item>
                            ) : (
                                <>
                                    <NavDropdown.Item as={Link} to="/perfil">
                                        <i className="bi bi-person me-2"></i> Meu Perfil
                                    </NavDropdown.Item>

                                    <NavDropdown.Divider />

                                    <NavDropdown.Item className="text-danger" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i> Sair
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
