import React, { useState } from 'react';

const SortControls = ({
    config, onConfigChange, onGenerate, onStart, onReset, onRepeat, onImport, onExport,
    isSorting, timeElapsed, array
}) => {
    const { mode, quantity, min, max, manualInput, direction, algorithm } = config;

    return (
        <div className="sort-controls-bar advanced">
            {/* --- Columna 1: Generación de Datos --- */}
            <div className="control-column" id="tour-step-1">
                <div className="control-group radio-group">
                    <label><input type="radio" value="random" checked={mode === 'random'} onChange={(e) => onConfigChange('mode', e.target.value)} disabled={isSorting} /> Aleatorio</label>
                    <label><input type="radio" value="manual" checked={mode === 'manual'} onChange={(e) => onConfigChange('mode', e.target.value)} disabled={isSorting} /> Manual</label>
                </div>

                {mode === 'random' ? (
                    <>
                        <div className="control-group"><label>Valor Mínimo:</label><input type="number" value={min} onChange={(e) => onConfigChange('min', parseInt(e.target.value))} disabled={isSorting} /></div>
                        <div className="control-group"><label>Valor Máximo:</label><input type="number" value={max} onChange={(e) => onConfigChange('max', parseInt(e.target.value))} disabled={isSorting} /></div>
                    </>
                ) : (
                    <div className="control-group"><label>Valores (separados por coma):</label><input type="text" value={manualInput} onChange={(e) => onConfigChange('manualInput', e.target.value)} disabled={isSorting} /></div>
                )}
                
                <div className="control-group">
                    <label>Cantidad: {quantity}</label>
                    <input type="range" min="5" max="50" value={quantity} onChange={(e) => onConfigChange('quantity', parseInt(e.target.value))} disabled={mode === 'manual' || isSorting} className="slider" />
                </div>
            </div>

            {/* --- Columna 2: Acciones --- */}
            <div className="control-column" id="tour-step-2">
                <div className="control-group">
                    <label>Algoritmo:</label>
                    <select id="tour-step-3" value={algorithm} onChange={(e) => onConfigChange('algorithm', e.target.value)} disabled={isSorting}>
                        <option value="insertion">Insertion Sort</option>
                        <option value="selection">Selection Sort</option>
                        <option value="merge">Merge Sort</option>
                        <option value="shell">Shell Sort</option>
                    </select>
                </div>
                <button className="sidebar-button" onClick={onGenerate} disabled={isSorting}>Generar</button>
                <button className="sidebar-button" onClick={onReset} disabled={isSorting}>Reset</button>
                <button className="sidebar-button" onClick={onRepeat} disabled={isSorting}>Repetir</button>
                <div className="control-group radio-group">
                    <label><input type="radio" value="asc" checked={direction === 'asc'} onChange={(e) => onConfigChange('direction', e.target.value)} disabled={isSorting}/> Ascendente</label>
                    <label><input type="radio" value="desc" checked={direction === 'desc'} onChange={(e) => onConfigChange('direction', e.target.value)} disabled={isSorting}/> Descendente</label>
                </div>
            </div>
            
            {/* --- Columna 3: Archivos y Simulación --- */}
            <div className="control-column" id="tour-step-4">
                 <div className="control-group button-group-stacked">
                    <button className="sidebar-button" onClick={onImport}>Importar</button>
                    <button className="sidebar-button" onClick={onExport}>Exportar</button>
                </div>
                <button className="start-sort-button" onClick={onStart} disabled={isSorting || !array || array.length === 0}>ORDENAR</button>
                <div className="timer">Tiempo: <span>{timeElapsed}</span></div>
            </div>
        </div>
    );
};

export default SortControls;