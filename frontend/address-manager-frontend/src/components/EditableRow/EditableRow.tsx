import React, { useState, useEffect } from 'react';
import { Col, Form, Button, Spinner } from 'react-bootstrap';
import { formatDate } from './utils'; 
import type { EditableRowProps } from './eidtable-row.model';


const EditableRow: React.FC<EditableRowProps> = ({ 
    label, 
    field, 
    value, 
    type = "text", 
    onSave 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value || "");
    const [isLoading, setIsLoading] = useState(false);

    // Sincroniza valor se o pai mudar (ex: após o save)
    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const handleConfirm = async () => {
        if (localValue === value) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            await onSave(field, String(localValue));
            setIsEditing(false);
        } catch (error) {
            // O erro é tratado no componente pai (Profile), 
            // mas aqui podemos manter o modo edição aberto se falhar
            console.log(error instanceof Error ? error.message : 'Não foi possível carregar seu perfil.');
            setLocalValue(String(value)); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Col md={12} className="mb-4 profile-row">
            <div className="profile-info-label text-muted small mb-1">{label}</div>
            <div className="d-flex align-items-center justify-content-between border-bottom pb-2" style={{ minHeight: '40px' }}>
                {isEditing ? (
                    <div className="d-flex w-100 align-items-center">
                        <Form.Control
                            autoFocus
                            type={type}
                            value={String(localValue)}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={handleConfirm}
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                            className="form-control-inline flex-grow-1"
                            disabled={isLoading}
                        />
                        {isLoading && <Spinner animation="border" size="sm" className="ms-2 text-primary" />}
                    </div>
                ) : (
                    <>
                        <span className="profile-info-value fw-semibold">
                            {type === 'date' ? formatDate(String(value)) : (type === 'password' ? '********' : value || 'Não informado')}
                        </span>
                        <Button 
                            variant="link" 
                            className="p-0 text-decoration-none" 
                            onClick={() => setIsEditing(true)}
                        >
                            <i className="bi bi-pencil-fill small text-primary"></i>
                        </Button>
                    </>
                )}
            </div>
        </Col>
    );
};

export default EditableRow;