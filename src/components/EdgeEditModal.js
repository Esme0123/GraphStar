import React, { useState, useEffect } from 'react';

const EdgeEditModal = ({ edge, onSave, onCancel }) => {
    const [label, setLabel] = useState(edge?.label || '');
    useEffect(() => {
        setLabel(edge?.label || '');
    }, [edge]);
    const handleSave = () => {
        onSave(edge.id, label);
    };
    if (!edge) {
        return null;
    }
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Conexión</h2>
                <div className="modal-input-group">
                    <label>Valor:</label>
                    <input 
                        type="text" 
                        value={label} 
                        onChange={(e) => setLabel(e.target.value)} 
                        placeholder="Ingresa un valor..."
                    />
                </div>
                <div className="modal-buttons">
                    <button className="modal-button cancel-button" onClick={onCancel}>Cancelar</button>
                    <button className="modal-button save-button" onClick={handleSave}>Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default EdgeEditModal;