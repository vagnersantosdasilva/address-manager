import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../services/auth.service';
import type { login } from '../../models/auth.model';
import './Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState<login>({
        cpf: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Limpeza preventiva ao carregar a tela de login
    useEffect(() => {
        localStorage.clear();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await authService.login(credentials);

            localStorage.setItem('@App:token', data.accessToken);
            localStorage.setItem('@App:refreshToken', data.refreshToken);

            navigate('/');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'CPF ou senha incorretos.');
            } else {
                setError('Não foi possível conectar ao servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-wrapper">
            <Card className="login-card shadow-lg">
                <Card.Body>
                    <div className="login-header">
                        <i className="bi bi-person-lock login-icon"></i>
                        <h2 className="login-title">Acessar Sistema</h2>
                        <p className="text-muted">Entre com suas credenciais para gerenciar endereços</p>
                    </div>

                    {error && (
                        <Alert variant="danger" className="py-2 small border-0 shadow-sm">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold small">CPF</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="bi bi-person text-muted"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    className="border-start-0"
                                    type="text"
                                    name="cpf"
                                    placeholder="Ex :09591525710"
                                    value={credentials.cpf}
                                    onChange={handleChange}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold small">Senha</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="bi bi-key text-muted"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    className="border-start-0"
                                    type="password"
                                    name="password"
                                    placeholder="Sua senha"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 btn-login mb-3 shadow-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <>
                                    Entrar <i className="bi bi-box-arrow-in-right ms-2"></i>
                                </>
                            )}
                        </Button>

                        <Button
                            variant="link"
                            className="w-100 text-decoration-none text-muted small"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Voltar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;