import React, { useState, useCallback, useRef, useEffect } from 'react';
import SortControls from './SortControls';
import SortVisualizer from './SortVisualizer';
import SortTourGuide from './SortTourGuide'; 
import { getInsertionSortAnimations } from '../algorithms/insertionSort';
import { getSelectionSortAnimations } from '../algorithms/selectionSort'; 
import { getMergeSortAnimations } from '../algorithms/mergeSort';
import { getShellSortAnimations } from '../algorithms/shellSort';

const generateRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const SortSimulatorPage = ({ onGoBack,showTutorial }) => {
    useEffect(() => {
            showTutorial('sort'); 
    }, []);
    const [config, setConfig] = useState({
        mode: 'random', quantity: 15, min: 5, max: 50,
        manualInput: '5,20,12,30,8', direction: 'asc', speed: 100,
        algorithm: 'insertion',
    });
    
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState('0.00s');
    const [animationState, setAnimationState] = useState({});
    const [runTour, setRunTour] = useState(false); // Estado para el tour
    const isPausedRef = useRef(isPaused);
    const animationTimeouts = useRef([]);
    const animationStep = useRef(0);
    const lastGeneratedArray = useRef([]);
    const startTimeRef = useRef(0);

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
            setConfig(prev => ({ ...prev, quantity: newArray.length }));
        }
        setArray(newArray);
        lastGeneratedArray.current = [...newArray];
    }, [config.mode, config.quantity, config.min, config.max, config.manualInput]);

    // Genera el array solo la primera vez que la página carga
    useEffect(() => {
        handleGenerate();
    }, [handleGenerate]);

    const stopAnimation = () => {
        animationTimeouts.current.forEach(clearTimeout);
        animationTimeouts.current = [];
        setIsSorting(false);
        setIsPaused(false);
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
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);
    const handlePauseResume = () => {
        if (!isSorting) return; 
        setIsPaused(prevIsPaused => !prevIsPaused);
    };
    const handleStart = () => {
        if (isSorting) return;
        
        handleRepeat(); // Reinicia al estado original
        setIsSorting(true);
        setIsPaused(false);
        animationStep.current = 0;
        startTimeRef.current = performance.now();
        
        const tempArray = [...lastGeneratedArray.current];
        let animations = [];

        switch (config.algorithm) {
            case 'insertion': animations = getInsertionSortAnimations(tempArray, config.direction); break;
            case 'selection': animations = getSelectionSortAnimations(tempArray, config.direction); break;
            case 'merge': animations = getMergeSortAnimations(tempArray, config.direction); break;
            case 'shell': animations = getShellSortAnimations(tempArray, config.direction); break;
            default: setIsSorting(false); return;
        }
        
        const runAnimationLoop = () => {
            if (isPausedRef.current) {
                const timeoutId = setTimeout(runAnimationLoop, 100);
                animationTimeouts.current.push(timeoutId);
                return;
            }
            if (animationStep.current >= animations.length) {
                const endTime = performance.now();
                setTimeElapsed(((endTime - startTimeRef.current) / 1000).toFixed(2) + 's');
                setArray(tempArray);
                setAnimationState({ sorted: tempArray.map((_, idx) => idx) });
                stopAnimation();
                return;
            }

            const [type, ...indices] = animations[animationStep.current];
            
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

            animationStep.current++;
            const timeoutId = setTimeout(runAnimationLoop, config.speed);
            animationTimeouts.current.push(timeoutId);
        };
        
        runAnimationLoop();
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
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.txt';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = readEvent => {
                const content = readEvent.target.result;
                handleConfigChange('manualInput', content);
                handleConfigChange('mode', 'manual');
                const newArray = content.split(',').map(n => parseInt(n.trim(), 10)).filter(num => !isNaN(num));
                setArray(newArray);
                lastGeneratedArray.current = [...newArray];
            };
            reader.readAsText(file);
        };
        input.click();
    };
    return (
        <div className="simulator-page-container">
            <SortTourGuide run={runTour} onTourEnd={() => setRunTour(false)} />
            <button id='tour-step-6' onClick={() => setRunTour(true)} className="help-button" title="Mostrar tutorial">?</button>

            <h1 className="simulator-title">Simulador de Ordenamiento</h1>
            <SortControls
                config={config} onConfigChange={handleConfigChange}
                onGenerate={handleGenerate} onStart={handleStart}
                onReset={handleReset} onRepeat={handleRepeat} onStop={handleReset}
                onImport={handleImport}
                onExport={handleExport}
                isSorting={isSorting} isPaused={isPaused} timeElapsed={timeElapsed}
                array={array}
                onPauseResume={handlePauseResume}
            />
            <SortVisualizer array={array} animationState={animationState} />
            <button className="back-button-simulator" onClick={onGoBack}>↩️ Volver a Conceptos</button>
        </div>
    );
};

export default SortSimulatorPage;