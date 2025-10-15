import React, { useState, useEffect } from 'react';

const SortControls = ({
    onAlgorithmChange, onStartSort, onResetArray, onSizeChange, onSpeedChange,
    isSorting, timeElapsed, initialInputValue, initialSize, initialSpeed
}) => {
    const [direction, setDirection] = useState('asc');
    const [inputValue, setInputValue] = useState(initialInputValue);

    useEffect(() => {
        setInputValue(initialInputValue);
    }, [initialInputValue]);

    return (
        <div className="sort-controls-bar">
            {/* --- Columna 1: Configuración del Array --- */}
            <div className="control-column">
                <div className="control-group">
                    <label>Valores (separados por coma):</label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => onResetArray(inputValue)}
                        disabled={isSorting}
                    />
                </div>
                <div className="control-group">
                    <label>Tamaño del Array: {initialSize}</label>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={initialSize}
                        onChange={(e) => onSizeChange(parseInt(e.target.value))}
                        disabled={isSorting}
                        className="slider"
                    />
                </div>
            </div>

            {/* --- Columna 2: Configuración del Algoritmo --- */}
            <div className="control-column">
                <div className="control-group">
                    <label>Algoritmo:</label>
                    <select onChange={(e) => onAlgorithmChange(e.target.value)} disabled={isSorting}>
                        <option value="insertion">Insertion Sort</option>
                        <option value="selection" disabled>Selection Sort</option>
                        <option value="merge" disabled>Merge Sort</option>
                        <option value="shell" disabled>Shell Sort</option>
                    </select>
                </div>
                <div className="control-group">
                    <label>Velocidad: {initialSpeed}ms</label>
                    <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={initialSpeed}
                        onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                        disabled={isSorting}
                        className="slider"
                    />
                </div>
            </div>

            {/* --- Columna 3: Acciones --- */}
            <div className="control-column actions">
                <div className="control-group button-group">
                    <button onClick={() => setDirection('asc')} className={direction === 'asc' ? 'active' : ''} disabled={isSorting}>Ascendente 🔼</button>
                    <button onClick={() => setDirection('desc')} className={direction === 'desc' ? 'active' : ''} disabled={isSorting}>Descendente 🔽</button>
                </div>
                <button className="start-sort-button" onClick={() => onStartSort({ direction })} disabled={isSorting}>
                    {isSorting ? 'Ordenando...' : 'ORDENAR'}
                </button>
                <div className="timer">
                    Tiempo: <span>{timeElapsed}</span>
                </div>
            </div>
        </div>
    );
};

export default SortControls;