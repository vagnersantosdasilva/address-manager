import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import './AddressForm.css';
import type { Address } from '../../../models/address.model';
import { addressService } from '../../../services/address.service';

const AddressForm: React.FC = () => {
    // userId vem da URL em rotas de admin (/admin/users/:userId/addresses/new)
    // id vem da URL em rotas de edição (/addresses/:id ou /admin/users/:userId/addresses/:id)
    const { idUser, id } = useParams<{ idUser?: string, id?: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Address>({
        zipCode: '',
        street: '',
        number: 0,
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        isMain: false,
        userId: 0
    });

    

    // Lógica para determinar qual ID de usuário usar (URL ou LocalStorage)
    const getResolvedUserId = (): number => {
        if (idUser) return Number(idUser);
        console.log('pelo idUser da url:',idUser)
        
        const stored = localStorage.getItem('@App:user');
        if (stored) {
            console.log('retornando do storage', JSON.parse(stored).id)
            return JSON.parse(stored).id;
        }
        return 0;
    };

    useEffect(() => {
        const targetUserId = getResolvedUserId();
        if (isEditMode && id) {
            loadAddress(targetUserId, Number(id));
        } else {
            setFormData(prev => ({ ...prev, userId: targetUserId }));
        }
    }, [id, idUser]);

    const loadAddress = async (uId: number, addrId: number) => {
        try {
            const all = await addressService.getAll(uId);
            
            const addr = all.find(a => a.id === addrId);
            if (addr) setFormData(addr);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar endereço.');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode && id) {
                await addressService.update(formData.userId, Number(id), formData);
            } else {
                await addressService.create(formData.userId, formData);
            }
            // Volta para a listagem (seja admin ou pessoal)
            navigate(-1); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar endereço.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <Container className="text-center py-5"><Spinner animation="border" /></Container>;

    return (
        <Container className="address-form-container">
            <h2 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                <i className="bi bi-geo-alt me-2"></i>
                {isEditMode ? 'Editar Endereço' : 'Novo Endereço'}
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="address-form-card shadow-sm">
                <Form onSubmit={handleSubmit}>
                    <h5 className="form-section-title">Localização</h5>
                    <Row>
                        <Col md={4} className="mb-3">
                            <Form.Group>
                                <Form.Label>CEP</Form.Label>
                                <Form.Control
                                    required
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="00000-000"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={8} className="mb-3">
                            <Form.Group>
                                <Form.Label>Logradouro (Rua/Avenida)</Form.Label>
                                <Form.Control
                                    required
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Número</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={9} className="mb-3">
                            <Form.Group>
                                <Form.Label>Complemento</Form.Label>
                                <Form.Control
                                    name="complement"
                                    value={formData.complement}
                                    onChange={handleChange}
                                    placeholder="Apto, Bloco, etc."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={5} className="mb-3">
                            <Form.Group>
                                <Form.Label>Bairro</Form.Label>
                                <Form.Control
                                    required
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={5} className="mb-3">
                            <Form.Group>
                                <Form.Label>Cidade</Form.Label>
                                <Form.Control
                                    required
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2} className="mb-3">
                            <Form.Group>
                                <Form.Label>Estado (UF)</Form.Label>
                                <Form.Control
                                    required
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    maxLength={2}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="is-main-check mt-3 mb-4">
                        <Form.Check 
                            type="checkbox"
                            label="Definir como endereço principal"
                            name="isMain"
                            checked={formData.isMain}
                            onChange={handleChange}
                            id="check-main"
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-3">
                        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="btn-save-address shadow-sm" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : 'Salvar Endereço'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default AddressForm;