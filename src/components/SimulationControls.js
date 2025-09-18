import React, { useState } from 'react';
const SimulationControls = ({ nodes, onSimulate, simulationResult, onClear }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mode, setMode] = useState('minimize');
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');

    const handleSimulateClick = () => {
        if (!source || !target) {
            alert("Por favor, selecciona un nodo de origen y uno de destino.");
            return;
        }
        onSimulate({ mode, source, target });
    };
    const handleToggle = () => {
      if (isExpanded) {
        onClear();
      }
      setIsExpanded(!isExpanded);
    }
    return (
        <>
            <button
                className={`sidebar-button ${isExpanded ? 'active-mode' : ''}`}
                onClick={handleToggle}
            >
                🚀 Simular Ruta (Johnson)
            </button>
            {isExpanded && (
                <div className="sidebar-submenu">
                    <p className="sidebar-label">Elige una opción:</p>
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="minimize">Minimizar (Más Corta)</option>
                        <option value="maximize">Maximizar (Más Larga)</option>
                    </select>

                    <p className="sidebar-label">Desde:</p>
                    <select value={source} onChange={(e) => setSource(e.target.value)}>
                        <option value="">Selecciona origen...</option>
                        {nodes.map(node => <option key={node.id} value={node.id}>{node.data.label}</option>)}
                    </select>

                    <p className="sidebar-label">Hasta:</p>
                    <select value={target} onChange={(e) => setTarget(e.target.value)}>
                        <option value="">Selecciona destino...</option>
                        {nodes.map(node => <option key={node.id} value={node.id}>{node.data.label}</option>)}
                    </select>
                    
                    <button className="sidebar-button simulate-button" onClick={handleSimulateClick}>
                        🛸 Calcular
                    </button>
                    
                    {simulationResult && (
                        <div className="simulation-result">
                            <p>{simulationResult.text}</p>
                            {simulationResult.path && <p>Ruta: {simulationResult.path.join(' → ')}</p>}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default SimulationControls;