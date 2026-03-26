import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Alert, Badge } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import EditableRow from '../../components/EditableRow/EditableRow';
import './Profile.css';
import type { User } from '../../models/user.model';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User| null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('@App:user') || '{}');
            const data = await userService.getById(storedUser.id);
            setUser(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Não foi possível carregar seu perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateField = async (field: string, newValue: string) => {
        try {
            if (!user || !user.id) {
                throw new Error("Usuário não carregado corretamente.");
            }
            const updatedUser = await userService.patch(user.id, { [field]: newValue });
            setUser(updatedUser);

            if (field === 'name') {
                const current = JSON.parse(localStorage.getItem('@App:user') || '{}');
                localStorage.setItem('@App:user', JSON.stringify({ ...current, name: updatedUser.name }));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar campo.");
            throw new Error( "Erro ao atualizar campo."); 
        }
    };

    if (loading) return <Container className="text-center py-5">Carregando...</Container>;

    return (
        <Container className="profile-container mt-4">
            <Card className="profile-card shadow-sm border-0">
                <div className="profile-header-accent"></div>
                <Card.Body className="px-4">
                    <div className="text-center mb-4" style={{ marginTop: '-40px' }}>
                        <i className="bi bi-person-circle display-1 text-primary bg-white rounded-circle"></i>
                        <h3 className="mt-2 fw-bold">{user?.name}</h3>
                        <Badge bg="light" text="dark" className="border">{user?.userType}</Badge>
                    </div>

                    {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

                    <Row className="mt-5">
                        <EditableRow label="NOME COMPLETO" field="name" value={String(user?.name)} onSave={handleUpdateField} />
                        <EditableRow label="CPF" field="cpf" value={String(user?.cpf)} onSave={handleUpdateField} />
                        <EditableRow label="DATA DE NASCIMENTO" field="birthDate" value={String(user?.birthDate)} type="date" onSave={handleUpdateField} />
                        <EditableRow label="SENHA" field="password" value="" type="password" onSave={handleUpdateField} />
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;