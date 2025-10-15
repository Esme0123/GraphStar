import React, { useState, useEffect } from 'react';
import SortControls from './SortControls';
import SortVisualizer from './SortVisualizer';
import { getInsertionSortAnimations } from '../algorithms/insertionSort';

// --- Funciones Auxiliares ---
const generateRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateRandomArray = (size) => {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(generateRandomInt(5, 50));
    }
    return array;
};


const SortSimulatorPage = ({ onGoBack }) => {
    // --- Estados ---
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [animationSpeed, setAnimationSpeed] = useState(100);
    const [algorithm, setAlgorithm] = useState('insertion');
    const [isSorting, setIsSorting] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState('0.00s');
    const [animationState, setAnimationState] = useState({});

    // --- Efecto para generar un array al inicio ---
    useEffect(() => {
        resetArray();
    }, [arraySize]); // Se regenera si cambia el tamaño

    const resetArray = (input) => {
        const newArray = input 
            ? input.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n))
            : generateRandomArray(arraySize);
        setArray(newArray);
        setAnimationState({ sorted: [] }); // Limpia el estado de animación
    };

    // --- Lógica Principal de Animación ---
    const startSorting = (config) => {
        setIsSorting(true);
        const startTime = performance.now();
        const tempArray = [...array];
        
        const animations = getInsertionSortAnimations(tempArray, config.direction);
        
        animations.forEach((step, i) => {
            setTimeout(() => {
                const [type, ...indices] = step;
                
                if (type === 'comparison') {
                    setAnimationState({ comparing: [indices[0], indices[1]], key: indices[1] });
                } else if (type === 'swap') {
                    setAnimationState({ swapping: [indices[0], indices[1]] });
                    // Realiza el intercambio en el array real
                    setArray(prevArray => {
                        const newArray = [...prevArray];
                        [newArray[indices[0]], newArray[indices[1]]] = [newArray[indices[1]], newArray[indices[0]]];
                        return newArray;
                    });
                } else if (type === 'place') {
                    // No necesitamos hacer nada visual aquí, el swap ya lo hizo
                }

                // Si es el último paso, finaliza todo
                if (i === animations.length - 1) {
                    setTimeout(() => {
                        const endTime = performance.now();
                        setTimeElapsed(((endTime - startTime) / 1000).toFixed(2) + 's');
                        setAnimationState({ sorted: array.map((_, idx) => idx) }); // Marca todo como ordenado
                        setIsSorting(false);
                    }, animationSpeed);
                }
            }, i * animationSpeed);
        });
    };

    return (
        <div className="simulator-page-container">
            <h1 className="simulator-title">Simulador de Ordenamiento</h1>
            <SortControls
                onAlgorithmChange={setAlgorithm}
                onStartSort={startSorting}
                onResetArray={resetArray}
                onSizeChange={setArraySize}
                onSpeedChange={setAnimationSpeed}
                isSorting={isSorting}
                timeElapsed={timeElapsed}
                initialInputValue={array.join(',')}
                initialSize={arraySize}
                initialSpeed={animationSpeed}
            />
            <SortVisualizer array={array} animationState={animationState} />
            <button className="back-button-simulator" onClick={onGoBack}>
                ↩️ Volver a Conceptos
            </button>
        </div>
    );
};

export default SortSimulatorPage;