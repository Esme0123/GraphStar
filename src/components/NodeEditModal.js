import React, { useState } from 'react';

const NodeEditModal = ({ node, onSave, onCancel }) => {
    const [label, setLabel] = useState(node.data.label);
    const [size, setSize] = useState(node.style?.width || 80);
    const [color, setColor] = useState(node.data.color || '#6A4C93');
    
    const handleSave = () => {
        onSave(node.id, { label, size, color });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Planeta</h2>
                <div className="modal-input-group">
                    <label>Nombre:</label>
                    <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
                </div>
                <div className="modal-input-group">
                    <label>Tamaño (px):</label>
                    <input type="number" value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} />
                </div>
                <div className="modal-input-group">
                    <label>Color:</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </div>
                <div className="modal-buttons">
                    <button className="modal-button cancel-button" onClick={onCancel}>Cancelar</button>
                    <button className="modal-button save-button" onClick={handleSave}>Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default NodeEditModal;