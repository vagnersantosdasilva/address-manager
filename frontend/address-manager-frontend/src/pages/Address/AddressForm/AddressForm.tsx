import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import './AddressForm.css';
import type { Address } from '../../../models/address.model';
import { addressService } from '../../../services/address.service';

const AddressForm: React.FC = () => {
    // 1. Definições de Rota e Identificação
    const { idUser, id } = useParams<{ idUser?: string, id?: string }>();
    const navigate = useNavigate();

    // UseMemo para evitar recálculos desnecessários e garantir consistência
    const { resolvedUserId, addressId, isEditMode } = useMemo(() => {
        const urlUserId = idUser && idUser !== 'undefined' ? Number(idUser) : null;
        const storedUser = JSON.parse(localStorage.getItem('@App:user') || '{}');
        
        return {
            resolvedUserId: urlUserId || Number(storedUser.id) || 0,
            addressId: id && id !== 'new' ? Number(id) : null,
            isEditMode: Boolean(id && id !== 'new' && !isNaN(Number(id)))
        };
    }, [idUser, id]);

    // 2. Estados do Formulário
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
        userId: resolvedUserId // Inicializa com o dono correto
    });

    // 3. Efeito de Carregamento Inicial (Apenas Edição)
    useEffect(() => {
        if (isEditMode && addressId) {
            loadAddress(resolvedUserId, addressId);
        } else {
            // Se for novo endereço, garante que o userId está no formData
            setFormData(prev => ({ ...prev, userId: resolvedUserId }));
        }
    }, [isEditMode, addressId, resolvedUserId]);

    const loadAddress = async (uId: number, addrId: number) => {
        try {
            const all = await addressService.getAll(uId);
            const addr = all.find(a => a.id === addrId);
            if (addr) {
                setFormData(addr);
            } else {
                setError("Endereço não encontrado.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar endereço.');
        } finally {
            setInitialLoading(false);
        }
    };

    // 4. Busca Automática de CEP
    useEffect(() => {
        const cleanCep = formData.zipCode.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            handleZipCodeBlur(cleanCep, resolvedUserId);
        }
    }, [formData.zipCode, resolvedUserId]);

    const handleZipCodeBlur = async (cep: string, userId: number) => {
        try {
            const data = await addressService.zipcode(userId, cep);
            setFormData(prev => ({
                ...prev,
                street: data.street || prev.street,
                neighborhood: data.neighborhood || prev.neighborhood,
                city: data.city || prev.city,
                state: data.state || prev.state
            }));
        } catch (err) {
            console.error("Erro ao buscar CEP:", err);
        }
    };

    // 5. Handlers de Eventos
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
            if (resolvedUserId === 0) throw new Error("Usuário não identificado.");

            if (isEditMode && addressId) {
                await addressService.update(resolvedUserId, addressId, formData);
            } else {
                await addressService.create(resolvedUserId, formData);
            }
            navigate(-1); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar endereço.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Carregando dados...</p>
            </Container>
        );
    }

    return (
        <Container className="address-form-container">
            <header className="mb-4">
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>
                    <i className="bi bi-geo-alt me-2"></i>
                    {isEditMode ? 'Editar Endereço' : 'Novo Endereço'}
                </h2>
                {idUser && <Alert variant="info" className="py-2">Modo Administrador: Gerenciando endereço do usuário ID {idUser}</Alert>}
            </header>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            <Card className="address-form-card shadow-sm">
                <Form onSubmit={handleSubmit}>
                    <h5 className="form-section-title mb-3">Localização</h5>
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

                    <hr />

                    <div className="is-main-check mb-4">
                        <Form.Check 
                            type="checkbox"
                            label="Definir como endereço principal"
                            name="isMain"
                            checked={formData.isMain}
                            onChange={handleChange}
                            id="check-main"
                            className="fw-bold"
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-3">
                        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="btn-save-address shadow-sm" disabled={loading}>
                            {loading ? <Spinner size="sm" className="me-2" /> : null}
                            {isEditMode ? 'Salvar Alterações' : 'Cadastrar Endereço'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default AddressForm;