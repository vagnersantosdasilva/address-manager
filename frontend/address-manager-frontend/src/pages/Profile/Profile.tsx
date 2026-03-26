import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import './Profile.css';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        birthDate: '',
        password: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('@App:user') || '{}');
            const data = await userService.getById(storedUser.id);
            setUser(data);
            setFormData({
                name: data.name,
                cpf: data.cpf,
                birthDate: data.birthDate,
                password: '' // Senha sempre vazia por segurança
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Não foi possível carregar seu perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const updatedUser = await userService.patch(user.id, formData);
            setUser(updatedUser);
            
            // Atualiza o nome no localStorage para o Header refletir a mudança
            const currentStored = JSON.parse(localStorage.getItem('@App:user') || '{}');
            localStorage.setItem('@App:user', JSON.stringify({ ...currentStored, name: updatedUser.name }));
            
            setSuccess(true);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao atualizar perfil.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

    return (
        <Container className="profile-container mb-5">
            <Card className="profile-card shadow-lg overflow-hidden">
                <div className="profile-header-bg">
                    <Badge pill className="badge-user-type shadow-sm">
                        {user?.userType}
                    </Badge>
                </div>
                
                <div className="profile-avatar-wrapper">
                    <i className="bi bi-person-circle profile-avatar-icon"></i>
                </div>

                <Card.Body className="px-5 pb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold m-0" style={{ color: 'var(--primary-color)' }}>Meu Perfil</h3>
                        {!isEditing && (
                            <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                                <i className="bi bi-pencil me-2"></i>Editar Dados
                            </Button>
                        )}
                    </div>

                    {success && <Alert variant="success" className="border-0 shadow-sm">Perfil atualizado com sucesso!</Alert>}
                    {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}

                    <Form onSubmit={handleSave}>
                        <Row>
                            <Col md={12}>
                                <div className="profile-info-label">Nome Completo</div>
                                {isEditing ? (
                                    <Form.Control 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="mb-3"
                                        required
                                    />
                                ) : (
                                    <div className="profile-info-value">{user?.name}</div>
                                )}
                            </Col>

                            <Col md={6}>
                                <div className="profile-info-label">CPF</div>
                                {isEditing ? (
                                    <Form.Control 
                                        name="cpf" 
                                        value={formData.cpf} 
                                        onChange={handleChange} 
                                        className="mb-3"
                                        required
                                    />
                                ) : (
                                    <div className="profile-info-value">{user?.cpf}</div>
                                )}
                            </Col>

                            <Col md={6}>
                                <div className="profile-info-label">Data de Nascimento</div>
                                {isEditing ? (
                                    <Form.Control 
                                        type="date"
                                        name="birthDate" 
                                        value={formData.birthDate} 
                                        onChange={handleChange} 
                                        className="mb-3"
                                        required
                                    />
                                ) : (
                                    <div className="profile-info-value">{user?.birthDate}</div>
                                )}
                            </Col>

                            {isEditing && (
                                <Col md={12} className="mt-2">
                                    <div className="profile-info-label">Nova Senha (Mín. 6 caracteres)</div>
                                    <Form.Control 
                                        type="password"
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="Digite para alterar ou deixe em branco"
                                        className="mb-3"
                                        minLength={6}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Por segurança, pedimos que confirme sua senha para salvar alterações.
                                    </Form.Text>
                                </Col>
                            )}
                        </Row>

                        {isEditing && (
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button variant="light" onClick={() => setIsEditing(false)} disabled={saving}>
                                    Cancelar
                                </Button>
                                <Button type="submit" className="btn-save-address shadow-sm" disabled={saving}>
                                    {saving ? <Spinner size="sm" /> : 'Salvar Alterações'}
                                </Button>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;