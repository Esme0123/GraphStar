import React, { useState } from 'react';

const EdgeValueModal = ({ sourceLabel, targetLabel, onConfirm, onSkip, onCancel }) => {
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    onConfirm(value.trim());
    setValue('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content compact-modal">
        <h2>Configurar peso de la ruta</h2>
        <p>
          Define el costo para la conexión entre <strong>{sourceLabel}</strong> y{' '}
          <strong>{targetLabel}</strong>. Puedes dejarlo vacío si no necesitas un valor.
        </p>
        <div className="modal-input-group">
          <label>Peso o distancia</label>
          <input
            type="number"
            step="any"
            placeholder="Ej. 42.5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-buttons">
          <button className="modal-button cancel-button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="modal-button neutral-button" onClick={onSkip}>
            Sin peso
          </button>
          <button className="modal-button save-button" onClick={handleConfirm}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EdgeValueModal;
