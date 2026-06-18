import React, { useEffect } from 'react';

export default function CustomModal({ isOpen, type, title, message, confirmText, cancelText, onConfirm, onCancel }) {
    // Escape key closes modal or cancels it
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                if (onCancel) onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    // Pick matching FontAwesome icon class
    const getIconClass = () => {
        switch (type) {
            case 'success': return 'fa-circle-check';
            case 'warning': return 'fa-triangle-exclamation';
            case 'danger': return 'fa-circle-xmark';
            case 'info':
            default:
                return 'fa-circle-info';
        }
    };

    return (
        <div className="custom-modal-overlay show" onClick={onCancel}>
            <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className={`custom-modal-icon ${type || 'info'}`}>
                    <i className={`fa-solid ${getIconClass()}`}></i>
                </div>
                <h3 className="custom-modal-title">{title}</h3>
                <p className="custom-modal-message">{message}</p>
                <div className="custom-modal-actions">
                    {onCancel && (
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onCancel}
                        >
                            {cancelText || 'Hủy bỏ'}
                        </button>
                    )}
                    <button 
                        type="button" 
                        className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`} 
                        onClick={onConfirm}
                        style={type === 'danger' ? { backgroundColor: '#c5221f', color: '#ffffff' } : {}}
                    >
                        {confirmText || 'Đồng ý'}
                    </button>
                </div>
            </div>
        </div>
    );
}
