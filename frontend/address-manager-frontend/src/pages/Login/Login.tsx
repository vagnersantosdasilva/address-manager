//import React, { useState } from 'react';
import { Alert, Button, Card, Container, Form, Row, Spinner } from 'react-bootstrap';
import type { login } from '../../models/auth.model';
import { useState } from 'react';
import { authService } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login: React.FC = () => {
    const navigate = useNavigate();

    // Estado inicial seguindo a interface 'login' (cpf e password)
    const [credentials, setCredentials] = useState<login>({
        cpf: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Função genérica para atualizar os campos do formulário
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

            // Salva os tokens no localStorage conforme configurado no interceptor
            localStorage.setItem('@App:token', data.accessToken);
            localStorage.setItem('@App:refreshToken', data.refreshToken);

            // Redireciona para a home ou dashboard
            navigate('/');
        } catch (err) {
            // Verificamos se o erro é de fato um erro do Axios
            if (axios.isAxiosError(err)) {
                // Agora o TS sabe que err é um AxiosError
                // O campo 'message' costuma vir na estrutura do seu backend
                const errorMessage = err.response?.data?.message || 'Erro nas credenciais.';
                setError(errorMessage);
            } else {
                // Erro genérico (ex: erro de rede ou erro de código)
                setError('Ocorreu um erro inesperado.');
                console.log(err);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container className='pe-5 ps-5'>
            <h2 className='d-flex justify-content-start m-2'>Login</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className='p-1 m-2'>
                <Form onSubmit={handleSubmit}>
                    <Card.Body>
                        <Container className="mt-1">
                            <Row className="justify-content-between">
                                <Form.Group className="mb-3">
                                    <Form.Label className="d-flex justify-content-start">CPF</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cpf"
                                        placeholder="000.000.000-00"
                                        value={credentials.cpf}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="d-flex justify-content-start">Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Digite sua senha"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>
                        </Container>
                    </Card.Body>
                    <Card.Footer>
                        <Row className="d-flex justify-content-end me-1 align-items-center">
                            <Button
                                variant="secondary"
                                onClick={() => navigate(-1)}
                                className='me-2'
                                style={{ width: '120px' }}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                type="submit"
                                style={{ width: '120px' }}
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Entrar'}
                            </Button>
                        </Row>
                    </Card.Footer>
                </Form>
            </Card>
        </Container>
    );

};

export default Login;