import React from 'react';

const ModeSelectionModal = ({ onSelectMode, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <button className="modal-close-button" onClick={onClose}>X</button>
                <h2>Selecciona un Modo de Trabajo</h2>
                <p>Elige cómo quieres usar el editor de grafos.</p>
                <div className="mode-selection-container">
                    <div className="mode-card" onClick={() => onSelectMode('pizarra')}>
                        <h3>✍️ Pizarra de Grafos</h3>
                        <p>Dibuja cualquier tipo de grafo sin restricciones. Ideal para experimentar y diseñar libremente.</p>
                    </div>
                    <div className="mode-card" onClick={() => onSelectMode('johnson')}>
                        <h3>🚀 Algoritmo de Johnson</h3>
                        <p>Un entorno preparado para el algoritmo de Johnson, con las reglas necesarias activadas (sin bucles, sin pesos negativos, etc.).</p>
                    </div>
                    <div className='mode-card' onClick ={() => onSelectMode('assignment')}>
                        <h3>👥 Algoritmo de Asignación</h3>
                        <p> 🔗 Un entorno preparado para resolver problemas de asignación. Incluye un grafo bipartito editable, herramientas para visualizar asignaciones óptimas paso a paso.</p>
                    </div>
                    <div className="mode-card" onClick={() => onSelectMode('dijkstra')}>
                        <h3>🛣️ Algoritmo de Dijkstra</h3>
                        <p>Encuentra la ruta minima o maxima (SSSP) de un nodo a otro usando el algoritmo de Dijkstra con visualización paso a paso.</p>
                    </div>
                    <div className="mode-card" onClick={() => onSelectMode('kruskal')}>
                        <h3>🌳 Algoritmo de Kruskal</h3>
                        <p>Encuentra el Árbol de Expansión Mínima (MST) usando el algoritmo de Kruskal con visualización paso a paso.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModeSelectionModal;
