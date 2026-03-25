import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container className="home-container">
            {/* Seção de Boas-Vindas */}
            <header className="hero-section">
                <h1 className="hero-title">Bem-vindo ao Address Manager</h1>
                <p className="hero-subtitle">
                    Uma solução centralizada para organizar, gerenciar e validar endereços de forma segura.
                </p>
                <div className="mt-4">
                    <Button 
                        variant="light" 
                        size="lg" 
                        className="fw-bold px-4 me-3"
                        style={{ color: 'var(--primary-color)' }}
                        onClick={() => navigate('/myaddresses')}
                    >
                        Meus Endereços
                    </Button>
                </div>
            </header>

            {/* O que o App faz */}
            <Row className="mt-5">
                <Col md={4} className="mb-4">
                    <Card className="feature-card shadow-sm text-center">
                        <Card.Body>
                            <i className="bi bi-shield-check feature-icon"></i>
                            <h4 className="feature-title">Gestão Segura</h4>
                            <p className="text-muted">
                                Controle de acesso onde apenas você ou administradores autorizados visualizam seus dados.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="feature-card shadow-sm text-center">
                        <Card.Body>
                            <i className="bi bi-geo-alt-fill feature-icon"></i>
                            <h4 className="feature-title">Múltiplos Endereços</h4>
                            <p className="text-muted">
                                Cadastre diversos endereços e defina um como principal para facilitar o uso em entregas e serviços.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="feature-card shadow-sm text-center">
                        <Card.Body>
                            <i className="bi bi-person-badge feature-icon"></i>
                            <h4 className="feature-title">Painel Admin</h4>
                            <p className="text-muted">
                                Ferramentas completas para administradores gerenciarem usuários e seus respectivos endereços.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Rodapé Simples da Home */}
            <footer className="mt-5 pt-4 border-top">
                <p className="text-muted small">
                    &copy; 2026 Address Manager Project - Desenvolvido com React & Spring Boot.
                </p>
            </footer>
        </Container>
    );
};

export default Home;