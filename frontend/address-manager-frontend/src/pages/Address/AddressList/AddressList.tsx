import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import './AddressList.css';
import type { Address } from '../../../models/address.model';
import { addressService } from '../../../services/address.service';


const AddressList: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // ID do usuário vindo da URL (para Admin)
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // Identifica o ID do usuário alvo
    const getTargetUserId = (): number | null => {
        if (id) return Number(id); // Se tem ID na URL, é o Admin visualizando alguém

        const storedUser = localStorage.getItem('@App:user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            return user.id;
        }
        return null;
    };

    const userId = getTargetUserId();

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        } else {
            setError("Usuário não identificado.");
            setLoading(false);
        }
    }, [id]);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const data = await addressService.getAll(userId!);
            setAddresses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar endereços.');
        } finally {
            setLoading(false);
        }
    };

    const handleNewAddress = () => {
        if (id) {
            // Se existe 'id' na URL, é o Admin agindo sobre um usuário específico
            navigate(`/admin/users/${id}/addresses/new`);
        } else {
            // Rota protegida e sem ID exposto para o usuário comum
            navigate('/myaddresses/new');
        }
    }

    const handleDelete = async (addressId: number) => {
        if (window.confirm("Remover este endereço?")) {
            try {
                await addressService.delete(userId!, addressId);
                setAddresses(prev => prev.filter(a => a.id !== addressId));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao deletar endereço.');
            }
        }
    };

    if (loading) return (
        <Container className="text-center py-5"><Spinner animation="border" variant="primary" /></Container>
    );

    return (
        <Container className="address-list-container py-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        {id ? `Endereços do Usuário #${id}` : 'Meus Endereços'}
                    </h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={handleNewAddress}
                        style={{ backgroundColor: 'var(--accent-color)', border: 'none' }}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Novo Endereço
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            <Row>
                {addresses.length > 0 ? (
                    addresses.map(address => (
                        <Col md={6} lg={4} key={address.id} className="mb-4">
                            <Card className="address-card shadow-sm h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="mb-0 text-truncate" style={{ maxWidth: '70%' }}>
                                            {address.street}, {address.number}
                                        </h5>
                                        {address.isMain && (
                                            <Badge className="main-address-badge">Principal</Badge>
                                        )}
                                    </div>

                                    <div className="address-info mb-3">
                                        <p className="mb-1"><span className="address-label">Bairro:</span> {address.neighborhood}</p>
                                        <p className="mb-1"><span className="address-label">Cidade:</span> {address.city} - {address.state}</p>
                                        <p className="mb-1"><span className="address-label">CEP:</span> {address.zipCode}</p>
                                        {address.complement && (
                                            <p className="mb-1"><span className="address-label">Compl.:</span> {address.complement}</p>
                                        )}
                                    </div>

                                    <div className="d-flex gap-2 border-top pt-3">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="w-100"
                                            onClick={() => navigate(`/users/${userId}/addresses/${address.id}`)}
                                        >
                                            <i className="bi bi-pencil me-1"></i> Editar
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(address.id!)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center py-5">
                        <i className="bi bi-house-door text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3 text-muted">Nenhum endereço cadastrado para este usuário.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default AddressList;