import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { ConfirmModalProps } from './confirm.model';

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    loading = false,
    variant = 'danger'
}) => {
    return (
        <Modal show={show} onHide={onCancel} centered backdrop="static">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold" style={{ color: `var(--${variant}-color, #dc3545)` }}>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-3">
                <p className="m-0 text-muted">{message}</p>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <Button variant="light" onClick={onCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button 
                    variant={variant} 
                    onClick={onConfirm} 
                    disabled={loading}
                    className="shadow-sm px-4"
                >
                    {loading ? 'Processando...' : 'Confirmar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;