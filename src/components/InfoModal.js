import React from 'react';

const InfoModal = ({ planet, onClose }) => {
    if (!planet) return null;

    return (
        <div className="info-modal-overlay" onClick={onClose}>
            <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="info-modal-close" onClick={onClose}>X</button>
                <h2>{planet.name}</h2>
                <p>{planet.info}</p>
                {/* Si tienes una imagen para el planeta, puedes mostrarla aquí */}
                {/* <img src={planet.imageUrl} alt={planet.name} /> */}
            </div>
        </div>
    );
};

export default InfoModal;