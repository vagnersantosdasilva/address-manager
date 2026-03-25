import { useEffect, useState } from "react";
import type { User } from "../../../models/user.model";
import { useNavigate } from "react-router-dom";
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { userService } from "../../../services/user.service";
import './UserList.css';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message :  'Erro ao carregar usuários. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Deseja realmente excluir este usuário?')) {
            try {
                await userService.delete(id); 
                setUsers(prev => prev.filter(user => user.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message :'Não foi possível excluir o usuário.');
            }
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

   return (
        <Container className="user-list-container">
            {/* Cabeçalho */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="user-list-title">
                        <i className="bi bi-people-fill me-2"></i> Usuários
                    </h2>
                    <p className="text-muted">Gerencie os acessos e informações dos usuários.</p>
                </Col>
                <Col className="text-end">
                    <Button 
                        onClick={() => navigate('/users/new')}
                        className="btn-new-user shadow-sm"
                    >
                        <i className="bi bi-plus-lg me-2"></i> Novo Usuário
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            {/* Tabela de Usuários */}
            <Card className="user-card-table shadow-sm">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="user-table-head">
                        <tr>
                            <th className="px-4">Nome</th>
                            <th>CPF</th>
                            <th>Tipo</th>
                            <th>Data Nasc.</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-4 user-name-cell">{user.name}</td>
                                <td>{user.cpf}</td>
                                <td>
                                    <Badge bg={user.userType === 'ADMIN' ? 'dark' : 'secondary'}>
                                        {user.userType}
                                    </Badge>
                                </td>
                                <td>{user.birthDate}</td>
                                <td className="px-4">
                                    <div className="action-buttons-container">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            title="Editar"
                                            onClick={() => navigate(`/users/${user.id}`)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Button>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            title="Endereços"
                                            onClick={() => navigate(`/users/${user.id}/addresses`)}
                                        >
                                            <i className="bi bi-geo-alt"></i>
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            title="Remover"
                                            onClick={() => handleDelete(user.id || 0)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                
                {users.length === 0 && !error && (
                    <div className="empty-state-container">
                        <i className="bi bi-inbox empty-state-icon"></i>
                        Nenhum usuário cadastrado.
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default UserList;