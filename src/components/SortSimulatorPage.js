import React, { useState, useCallback, useRef, useEffect } from 'react';
import SortControls from './SortControls';
import SortVisualizer from './SortVisualizer';
import SortTourGuide from './SortTourGuide'; // Importamos el componente del tour
import { getInsertionSortAnimations } from '../algorithms/insertionSort';
import { getSelectionSortAnimations } from '../algorithms/selectionSort'; 
import { getMergeSortAnimations } from '../algorithms/mergeSort';
import { getShellSortAnimations } from '../algorithms/shellSort';

const generateRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const SortSimulatorPage = ({ onGoBack }) => {
    const [config, setConfig] = useState({
        mode: 'random', quantity: 15, min: 5, max: 50,
        manualInput: '5,20,12,30,8', direction: 'asc', speed: 100,
        algorithm: 'insertion',
    });
    
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState('0.00s');
    const [animationState, setAnimationState] = useState({});
    const [runTour, setRunTour] = useState(false); // Estado para el tour
    const lastGeneratedArray = useRef([]);
    const animationTimeouts = useRef([]);

    const handleConfigChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleGenerate = useCallback(() => {
        stopAnimation();
        let newArray = [];
        if (config.mode === 'random') {
            const size = config.quantity;
            for (let i = 0; i < size; i++) {
                newArray.push(generateRandomInt(config.min, config.max));
            }
        } else {
            newArray = config.manualInput.split(',').map(n => parseInt(n.trim(), 10)).filter(num => !isNaN(num));
            handleConfigChange('quantity', newArray.length);
        }
        setArray(newArray);
        lastGeneratedArray.current = [...newArray];
    }, [config]);

    // Genera el array solo la primera vez que la página carga
    useEffect(() => {
        handleGenerate();
    }, []);

    const stopAnimation = () => {
        animationTimeouts.current.forEach(clearTimeout);
        animationTimeouts.current = [];
        setIsSorting(false);
    };

    const handleReset = () => {
        stopAnimation();
        setArray([]);
        lastGeneratedArray.current = [];
        setAnimationState({});
        setTimeElapsed('0.00s');
    };

    const handleRepeat = () => {
        stopAnimation();
        setArray([...lastGeneratedArray.current]);
        setAnimationState({});
        setTimeElapsed('0.00s');
    };

    const handleStart = () => {
        if (isSorting || array.length === 0) return;
        
        setIsSorting(true);
        setAnimationState({});
        const startTime = performance.now();
        const tempArray = [...array];
        let animations = [];

        // Aquí se decide qué algoritmo usar
        switch (config.algorithm) {
            case 'insertion': animations = getInsertionSortAnimations(tempArray, config.direction); break;
            case 'selection': animations = getSelectionSortAnimations(tempArray, config.direction); break;
            case 'merge': animations = getMergeSortAnimations(tempArray, config.direction); break;
            case 'shell': animations = getShellSortAnimations(tempArray, config.direction); break;
            default:
                alert(`El algoritmo ${config.algorithm} aún no está implementado.`);
                setIsSorting(false);
                return;
        }

        animations.forEach((step, i) => {
            const timeoutId = setTimeout(() => {
                const [type, ...indices] = step;
                if (type === 'comparison') setAnimationState({ comparing: indices });
                else if (type === 'swap') {
                    setAnimationState({ swapping: indices });
                    setArray(prev => {
                        const newArr = [...prev];
                        [newArr[indices[0]], newArr[indices[1]]] = [newArr[indices[1]], newArr[indices[0]]];
                        return newArr;
                    });
                } else if (type === 'overwrite') {
                    setAnimationState({ swapping: [indices[0]] });
                    setArray(prev => {
                        const newArr = [...prev];
                        newArr[indices[0]] = indices[1];
                        return newArr;
                    });
                }
                if (i === animations.length - 1) {
                    setTimeout(() => {
                        const endTime = performance.now();
                        setTimeElapsed(((endTime - startTime) / 1000).toFixed(2) + 's');
                        setArray(tempArray);
                        setAnimationState({ sorted: tempArray.map((_, idx) => idx) });
                        setIsSorting(false);
                    }, config.speed);
                }
            }, i * config.speed);
            animationTimeouts.current.push(timeoutId);
        });
    };
    
    const handleExport = () => {
        if (array.length === 0) { alert("No hay datos para exportar."); return; }
        const fileName = prompt("Ingresa el nombre del archivo:", "constelacion.txt");
        if (!fileName) return;

        const text = array.join(',');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="simulator-page-container">
            <SortTourGuide run={runTour} onTourEnd={() => setRunTour(false)} />
            <button onClick={() => setRunTour(true)} className="help-button" title="Mostrar tutorial">?</button>

            <h1 className="simulator-title">Simulador de Ordenamiento</h1>
            <SortControls
                config={config} onConfigChange={handleConfigChange}
                onGenerate={handleGenerate} onStart={handleStart}
                onReset={handleReset} onRepeat={handleRepeat}
                onImport={() => alert("Función de importar no implementada aún.")} // Placeholder
                onExport={handleExport}
                isSorting={isSorting} timeElapsed={timeElapsed}
            />
            <SortVisualizer array={array} animationState={animationState} />
            <button className="back-button-simulator" onClick={onGoBack}>↩️ Volver a Conceptos</button>
        </div>
    );
};

export default SortSimulatorPage;