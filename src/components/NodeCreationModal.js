import React, { useState } from 'react';

const NodeCreationModal = ({ onConfirm, onCancel }) => {
  const [label, setLabel] = useState('');

  const handleConfirm = () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      return;
    }
    onConfirm(trimmedLabel);
    setLabel('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content compact-modal">
        <h2>Nombrar nuevo planeta</h2>
        <p>Asigna un nombre para identificar al nodo que estás por crear.</p>
        <div className="modal-input-group">
          <label>Nombre del planeta</label>
          <input
            type="text"
            placeholder="Ej. Nebulosa X-9"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-buttons">
          <button className="modal-button cancel-button" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="modal-button save-button"
            onClick={handleConfirm}
            disabled={!label.trim()}
          >
            Crear planeta
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeCreationModal;
