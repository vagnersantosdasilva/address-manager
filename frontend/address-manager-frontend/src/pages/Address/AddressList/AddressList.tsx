import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import './AddressList.css';
import type { Address } from '../../../models/address.model';
import { addressService } from '../../../services/address.service';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';


const AddressList: React.FC = () => {
    const { idUser } = useParams<{ idUser: string }>(); // ID do usuário vindo da URL (para Admin)
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Novos estados para o Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    // Identifica o ID do usuário alvo
    const getTargetUserId = (): number | null => {
        if (idUser) return Number(idUser); // Se tem ID na URL, é o Admin visualizando alguém

        const storedUser = localStorage.getItem('@App:user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            return user.id;
        }
        return null;
    };

    const userId = getTargetUserId();
    const userJson = localStorage.getItem('@App:user');
    const user = userJson ? JSON.parse(userJson) : null;

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        } else {
            setError("Usuário não identificado.");
            setLoading(false);
        }
    }, [idUser]);

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
        console.log('chamando handle', getTargetUserId())
        if (idUser) {
            // Se existe 'id' na URL, é o Admin agindo sobre um usuário específico
            console.log('chamando new address com 0')
            navigate(`/users/${idUser}/addresses/new`);
        } else {
            // Rota protegida e sem ID exposto para o usuário comum
            navigate('/myaddresses/news');
        }
    }

    const handleEditAddress = async (addressId: number) => {
        console.log(user)
        if (user && user.userType === 'COMMON') {
            console.log('para o myaddress', addressId);
            navigate(`/myaddresses/${addressId}`)
        }
        else

            if (userId && addressId) {
                navigate(`/users/${userId}/addresses/${addressId}`)
            }
    };

    // 1. Abrir o modal e guardar id de endereco
    const handleDelete = (addressId: number) => {
        setAddressToDelete(addressId);
        setShowDeleteModal(true);
    };

    // 2. Confirmar exclusao
    const handleConfirmDelete = async () => {
        if (!addressToDelete || !userId) return;

        setIsDeleting(true);
        setError(null);
        try {
            await addressService.delete(userId, addressToDelete);
            setAddresses(prev => prev.filter(a => a.id !== addressToDelete));
            setShowDeleteModal(false); // Fecha o modal após sucesso
            fetchAddresses()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao deletar endereço.');
            setShowDeleteModal(false); // Fecha mesmo se der erro para mostrar o Alert de erro da página
        } finally {
            setIsDeleting(false);
            setAddressToDelete(null);
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
                        {idUser ? `Endereços do Usuário #${idUser}` : 'Meus Endereços'}
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
                                            onClick={() => handleEditAddress(address.id!)}
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

            <ConfirmModal
                show={showDeleteModal}
                title="Excluir Endereço"
                message="Tem certeza que deseja remover este endereço? Esta ação não pode ser desfeita."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                loading={isDeleting}
                variant="danger"
            />
        </Container>
    );
};

export default AddressList;