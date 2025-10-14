import React from 'react';

const SortSimulatorPage = ({ onGoBack }) => {
    return (
        <div className="simulator-page-container">
            <h1 className="simulator-title">Simulador de Ordenamiento</h1>
            <div className="simulator-content-placeholder">
                <p>Aquí se mostrará la simulación interactiva de los algoritmos de ordenamiento.</p>
                <p>¡Próximamente!</p>
            </div>
            <button className="back-button-simulator" onClick={onGoBack}>
                ↩️ Volver a Conceptos
            </button>
        </div>
    );
};

export default SortSimulatorPage;