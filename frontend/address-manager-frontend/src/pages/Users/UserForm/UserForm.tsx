import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { userService } from '../../../services/user.service';
import './UserForm.css';
import type { User } from '../../../models/user.model';

const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Pega o ID da URL se for edição
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<User>({
        name: '',
        cpf: '',
        birthDate: '',
        userType: 'COMMON',
        password: ''
    });

    useEffect(() => {
        if (isEditMode) {
            loadUser(Number(id));
        }
    }, [id, isEditMode]);

    const loadUser = async (userId: number) => {
        try {
            const user = await userService.getById(userId);
            setFormData({ ...user, password: '' }); // Não carregar a senha 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados do usuário.');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement| HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = { ...formData };

            if (isEditMode && !payload.password?.trim()) {
                delete payload.password;
            }

            if (isEditMode) {
                await userService.update(Number(id), payload);
            } else {
                await userService.create(payload);
            }
            navigate('/users');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao tentar salvar usuário');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="user-form-container">
            <header className="mb-4">
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>
                    <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
                    {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <p className="text-muted">Preencha as informações abaixo para {isEditMode ? 'atualizar' : 'cadastrar'} o usuário.</p>
            </header>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="user-form-card shadow-sm">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Nome Completo</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ex: João Silva"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>CPF</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    placeholder="00000000000"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Data de Nascimento</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Tipo de Usuário</Form.Label>
                                <Form.Select
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                >
                                    <option value="COMMON">Comum (COMMON)</option>
                                    <option value="ADMIN">Administrador (ADMIN)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={isEditMode ? "Deixe em branco para manter" : "Senha de acesso"}
                                    required={!isEditMode}
                                />
                                {isEditMode && <div className="password-note">Preencha apenas se desejar alterar a senha atual.</div>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="form-actions">
                        <Button
                            variant="outline-secondary"
                            className="btn-cancel"
                            onClick={() => navigate('/users')}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="btn-save shadow-sm"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" /> : 'Salvar Alterações'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default UserForm;