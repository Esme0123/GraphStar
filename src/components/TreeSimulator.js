import React, { useState, useCallback, useRef, useEffect } from 'react';
import TreeTourGuide from './TreeTourGuide';

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    insert(value) {
        const newNode = new TreeNode(value);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }
    insertNode(node, newNode) {
        if (newNode.value === node.value) return; // No permitir duplicados

        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
    // Secuencia de animaciones
    getInOrderAnimations() {
        const animations = [];
        this.inOrderTraverse(this.root, animations);
        return animations;
    }
    inOrderTraverse(node, animations) {
        if (node !== null) {
            this.inOrderTraverse(node.left, animations);
            animations.push(node.value);
            this.inOrderTraverse(node.right, animations);
        }
    }

    getPreOrderAnimations() {
        const animations = [];
        this.preOrderTraverse(this.root, animations);
        return animations;
    }
    preOrderTraverse(node, animations) {
        if (node !== null) {
            animations.push(node.value);
            this.preOrderTraverse(node.left, animations);
            this.preOrderTraverse(node.right, animations);
        }
    }

    getPostOrderAnimations() {
        const animations = [];
        this.postOrderTraverse(this.root, animations);
        return animations;
    }  
    postOrderTraverse(node, animations) {
        if (node !== null) {
            this.postOrderTraverse(node.left, animations);
            this.postOrderTraverse(node.right, animations);
            animations.push(node.value);
        }
    }
    // Convierte el árbol a un objeto serializable para JSON y para el renderizado
    serialize() {
        return this._serializeNode(this.root);
    }
    _serializeNode(node) {
        if (node === null) return null;
        return {
            value: node.value,
            left: this._serializeNode(node.left),
            right: this._serializeNode(node.right)
        };
    }
    // Crea un árbol a partir de un objeto serializado
    static fromSerialized(serializedData) {
        const tree = new BinarySearchTree();
        if (serializedData) {
            tree.root = tree._deserializeNode(serializedData);
        }
        return tree;
    }

    _deserializeNode(nodeData) {
        if (nodeData === null) return null;
        const node = new TreeNode(nodeData.value);
        node.left = this._deserializeNode(nodeData.left);
        node.right = this._deserializeNode(nodeData.right);
        return node;
    }
}
// // --- Componentes de React ---

// // Estilos CSS embebidos para mantener todo en un archivo
const Styles = () => (
    <style>{`
        :root {
            --blanco-estelar: #E5E5E5;
            --negro-cosmico: #121212;
            --azul-nebulosa: #2C3E50;
            --verde-galactico: #27AE60;
            --rojo-supernova: #C0392B;
            --amarillo-cometa: #F1C40F;
            --font-title: 'Orbitron', sans-serif;
            --font-text: 'Roboto', sans-serif;
        }

        .tree-simulator-container {
            position: relative; /* Needed for the back button positioning */
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background-color: var(--negro-cosmico);
            color: var(--blanco-estelar);
            font-family: var(--font-text);
            min-height: 100vh;
            background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
        }

        .back-button-simulator {
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: transparent;
            color: var(--verde-galactico);
            border: 2px solid var(--verde-galactico);
            border-radius: 25px;
            padding: 10px 15px;
            font-family: var(--font-text);
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 100;
        }
        .back-button-simulator:hover {
            background-color: var(--verde-galactico);
            color: var(--negro-cosmico);
            box-shadow: 0 0 10px var(--verde-galactico);
        }

        .simulator-title {
            font-family: var(--font-title);
            font-size: 2.5rem;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 20px;
            text-shadow: 0 0 10px var(--verde-galactico);
        }

        .traversal-buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }

        .traversal-btn {
            padding: 10px 20px;
            font-family: var(--font-title);
            font-size: 1rem;
            background-color: transparent;
            color: var(--verde-galactico);
            border: 2px solid var(--verde-galactico);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .traversal-btn.active, .traversal-btn:hover {
            background-color: var(--verde-galactico);
            color: var(--negro-cosmico);
            box-shadow: 0 0 15px var(--verde-galactico);
        }
        .traversal-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .controls-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            padding: 20px;
            background-color: rgba(44, 62, 80, 0.5);
            border-radius: 15px;
            border: 1px solid var(--verde-galactico);
            width: 100%;
            max-width: 800px;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
        }
        
        .random-controls-group {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 15px;
            align-items: flex-end;
        }
    
        .input-pair {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }

        .control-group label {
            font-weight: bold;
        }
        
        .control-group input[type="number"],
        .control-group input[type="text"] {
            background-color: var(--negro-cosmico);
            color: var(--blanco-estelar);
            border: 1px solid var(--verde-galactico);
            border-radius: 5px;
            padding: 8px;
            width: 80px;
            text-align: center;
        }
        
        .io-buttons {
             display: flex;
             gap: 10px;
        }

        .io-btn {
            padding: 8px 15px;
            background-color: var(--azul-nebulosa);
            color: var(--blanco-estelar);
            border: 1px solid var(--verde-galactico);
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .io-btn:hover {
            background-color: var(--verde-galactico);
        }

        .traversal-result {
            margin-top: 20px;
            padding: 15px;
            background-color: rgba(0,0,0,0.3);
            border: 1px dashed var(--verde-galactico);
            border-radius: 10px;
            min-height: 50px;
            width: 100%;
            max-width: 800px;
            text-align: center;
            font-size: 1.2rem;
            letter-spacing: 2px;
        }
        .traversal-result-placeholder {
            color: #888;
        }

        .tree-visualizer {
            position: relative;
            width: 100%;
            min-height: 400px;
            margin-top: 30px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow-x: auto;
            padding-bottom: 20px;
        }
        
        .node-container {
            position: absolute;
            display: flex;
            justify-content: center;
            transition: all 0.5s ease-in-out;
        }
        
        .planet-node {
            display: flex; 
            justify-content: center; 
            align-items: center;
            color: var(--blanco-estelar); 
            font-family: var(--font-text);
            font-weight: bold;
            font-size: 25px;
            text-align: center; 
            cursor: grab;
            word-break: break-word; 
            border-radius: 50%;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.4);
            text-shadow: 0 0 5px black; 
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, #4a90e2, #1a237e);
            border: 2px solid #aed6f1;
            transition: all 0.3s ease;
            position: relative;
            z-index: 10;
        }
        
        .planet-node.highlighted {
            transform: scale(1.2);
            box-shadow: 0 0 25px 5px var(--verde-galactico), inset 0 0 15px rgba(255,255,255,0.5);
            background: radial-gradient(circle, #27AE60, #145A32);
        }
        
        .line {
            position: absolute;
            background-color: rgba(174, 214, 241, 0.5);
            z-index: 1;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: var(--azul-nebulosa);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid var(--verde-galactico);
            box-shadow: 0 0 20px var(--verde-galactico);
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
        }

        .modal-content h3 {
            margin: 0;
            font-family: var(--font-title);
        }

        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--amarillo-cometa);
            color: var(--negro-cosmico);
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 2000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-weight: bold;
            animation: fadeInOut 3s ease-in-out;
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; top: 0px; }
            20% { opacity: 1; top: 20px; }
            80% { opacity: 1; top: 20px; }
            100% { opacity: 0; top: 0px; }
        }

    `}</style>
);

// Componente para visualizar el árbol
const TreeVisualizer = ({ treeData, highlightedNode, nodePositions }) => {
    
    const renderNode = (node) => {
        if (!node || !nodePositions[node.value]) return null;

        const { x, y } = nodePositions[node.value];
        const hasLeft = node.left && nodePositions[node.left.value];
        const hasRight = node.right && nodePositions[node.right.value];

        return (
            <React.Fragment key={node.value}>
                {hasLeft && <Line from={nodePositions[node.value]} to={nodePositions[node.left.value]} />}
                {hasRight && <Line from={nodePositions[node.value]} to={nodePositions[node.right.value]} />}
                
                <div className="node-container" style={{ left: `${x}px`, top: `${y}px`, transform: 'translateX(-50%)' }}>
                     <div className={`planet-node ${highlightedNode === node.value ? 'highlighted' : ''}`}>
                        {node.value}
                    </div>
                </div>
                
                {hasLeft && renderNode(node.left)}
                {hasRight && renderNode(node.right)}
            </React.Fragment>
        );
    };
    
    return <div className="tree-visualizer">{treeData && renderNode(treeData)}</div>;
};
// Componente para las líneas que conectan los nodos
const Line = ({ from, to }) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));

    const style = {
        transform: `rotate(${angle}deg)`,
        width: `${distance}px`,
        height: '2px',
        left: `${from.x}px`,
        top: `${from.y + 30}px`, // +30 para centrar la línea con el nodo
        transformOrigin: '0 0',
    };

    return <div className="line" style={style}></div>;
};

// --- Modales ---
const InsertNodeModal = ({ onInsert, onCancel }) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleSubmit = () => {
        const num = parseInt(value, 10);
        if (!isNaN(num)) {
            onInsert(num);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Insertar Nodo</h3>
                <input
                    ref={inputRef}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Ingrese un número"
                />
                <div className="io-buttons">
                    <button className="io-btn" onClick={handleSubmit}>Insertar</button>
                    <button className="io-btn" onClick={onCancel}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

const ExportFileModal = ({ onExport, onCancel }) => {
    const [fileName, setFileName] = useState('arbol.json');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleSubmit = () => {
        if (fileName.trim()) {
            onExport(fileName);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Exportar Árbol</h3>
                <input
                    ref={inputRef}
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="nombre-del-archivo.json"
                />
                <div className="io-buttons">
                    <button className="io-btn" onClick={handleSubmit}>Exportar</button>
                    <button className="io-btn" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal ---
const TreeSimulator = ({ onGoBack,showTutorial }) => { 
    useEffect(() => {
        showTutorial('tree'); 
    }, []);
    const [treeInstance, setTreeInstance] = useState(new BinarySearchTree());
    const [treeData, setTreeData] = useState(null); 
    const [nodePositions, setNodePositions] = useState({});

    const [config, setConfig] = useState({
        mode: 'manual',
        min: 1,
        max: 100,
        quantity: 10,
    });
    
    const [isTraversing, setIsTraversing] = useState(false);
    const [traversalType, setTraversalType] = useState('');
    const [traversalResult, setTraversalResult] = useState([]);
    const [highlightedNode, setHighlightedNode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [notification, setNotification] = useState('');
    const [runTour, setRunTour] = useState(false); // Estado para el tour

    const timeouts = useRef([]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const calculateNodePositions = useCallback((treeRoot) => {
        if (!treeRoot) {
            setNodePositions({});
            return;
        }

        const positions = {};
        const HORIZONTAL_BASE_SPACING = 400; 
        const HORIZONTAL_DECAY_RATE = 1.9; 
        const VERTICAL_SPACING = 90;     
        const containerWidth = document.querySelector('.tree-visualizer')?.clientWidth || 800;

        function traverse(node, level, x, side) {
            if (!node) return;

            const horizontalOffset = HORIZONTAL_BASE_SPACING / Math.pow(HORIZONTAL_DECAY_RATE, level);
            
            const newX = side === 'left' 
                ? x - horizontalOffset
                : side === 'right'
                ? x + horizontalOffset
                : x;

            positions[node.value] = { x: newX, y: level * VERTICAL_SPACING };

            traverse(node.left, level + 1, newX, 'left');
            traverse(node.right, level + 1, newX, 'right');
        }

        traverse(treeRoot, 0, containerWidth / 2, 'center');
        setNodePositions(positions);
    }, []);
    
    useEffect(() => {
        calculateNodePositions(treeData);
        const handleResize = () => calculateNodePositions(treeData);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [treeData, calculateNodePositions]);
    
    const stopTraversal = () => {
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];
        setIsTraversing(false);
        setHighlightedNode(null);
        setTraversalType('');
    };

    const handleConfigChange = (key, value) => {
        const numValue = parseInt(value, 10);
        setConfig(prev => ({ ...prev, [key]: isNaN(numValue) ? value : numValue }));
    };

    const handleInsert = useCallback((value) => {
        stopTraversal();
        treeInstance.insert(value);
        setTreeInstance(treeInstance);
        setTreeData(treeInstance.serialize());
        setTraversalResult([]);
        setIsModalOpen(false);
    }, [treeInstance]);
    
    const handleGenerate = () => {
        stopTraversal();
        const newTree = new BinarySearchTree();
        const generatedNumbers = new Set();
        if (config.quantity > config.max - config.min + 1) {
            showNotification("La cantidad no puede ser mayor que el rango de valores.");
            return;
        }
        while (generatedNumbers.size < config.quantity) {
             const randomNum = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
             generatedNumbers.add(randomNum);
        }
        generatedNumbers.forEach(num => newTree.insert(num));
        setTreeInstance(newTree);
        setTreeData(newTree.serialize());
        setTraversalResult([]);
    };

    const handleReset = () => {
        stopTraversal();
        setTreeInstance(new BinarySearchTree());
        setTreeData(null);
        setTraversalResult([]);
    };
    
    const handleStartTraversal = (type) => {
        if (isTraversing || !treeInstance.root) return;
        
        stopTraversal();
        setTraversalResult([]);
        setTraversalType(type);

        let animations = [];
        if (type === 'IN ORDER') animations = treeInstance.getInOrderAnimations();
        else if (type === 'PRE ORDER') animations = treeInstance.getPreOrderAnimations();
        else if (type === 'POST ORDER') animations = treeInstance.getPostOrderAnimations();

        setIsTraversing(true);

        animations.forEach((nodeValue, index) => {
            const timeoutId = setTimeout(() => {
                setHighlightedNode(nodeValue);
                setTraversalResult(prev => [...prev, nodeValue]);
                if (index === animations.length - 1) {
                     setTimeout(() => {
                        setIsTraversing(false);
                        setHighlightedNode(null);
                     }, 1000);
                }
            }, index * 1000); 
            timeouts.current.push(timeoutId);
        });
    };

    const handleExportRequest = () => {
        if (!treeData) {
            showNotification("El árbol está vacío. No hay nada que exportar.");
            return;
        }
        setIsExportModalOpen(true);
    };

    const handleExport = (fileName) => {
        const jsonString = JSON.stringify(treeData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExportModalOpen(false);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = readEvent => {
                try {
                    const content = JSON.parse(readEvent.target.result);
                    const newTree = BinarySearchTree.fromSerialized(content);
                    handleReset();
                    setTreeInstance(newTree);
                    setTreeData(newTree.serialize());
                } catch (error) {
                    showNotification("Error al leer el archivo. Verifique el formato.");
                    console.error("Error al importar JSON:", error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };


    return (
        <div className="tree-simulator-container">
            <TreeTourGuide run={runTour} onTourEnd={() => setRunTour(false)} />
            <button id='tour-tree-step-8' onClick={() => setRunTour(true)} className="help-button" title="Mostrar tutorial">?</button>
            <Styles />
            {isModalOpen && <InsertNodeModal onInsert={handleInsert} onCancel={() => setIsModalOpen(false)} />}
            {isExportModalOpen && <ExportFileModal onExport={handleExport} onCancel={() => setIsExportModalOpen(false)} />}
            {notification && <div className="notification">{notification}</div>}

            <button className="back-button-simulator" onClick={onGoBack}>
                ↩️ Volver a Conceptos
            </button>
            
            <h1 className="simulator-title">Simulador de Árboles</h1>

            <div className="traversal-buttons" id= "tour-tree-step-1">
                <button className={`traversal-btn ${traversalType === 'IN ORDER' ? 'active' : ''}`} onClick={() => handleStartTraversal('IN ORDER')} disabled={isTraversing}>IN ORDER</button>
                <button className={`traversal-btn ${traversalType === 'POST ORDER' ? 'active' : ''}`} onClick={() => handleStartTraversal('POST ORDER')} disabled={isTraversing}>POST ORDER</button>
                <button className={`traversal-btn ${traversalType === 'PRE ORDER' ? 'active' : ''}`} onClick={() => handleStartTraversal('PRE ORDER')} disabled={isTraversing}>PRE ORDER</button>
            </div>
            
            <div className="controls-container" id = "tour-tree-step-2">
                <div className="control-group">
                    <label><input type="radio" value="random" checked={config.mode === 'random'} onChange={(e) => handleConfigChange('mode', e.target.value)} disabled={isTraversing} /> Aleatorio</label>
                    <label><input type="radio" value="manual" checked={config.mode === 'manual'} onChange={(e) => handleConfigChange('mode', e.target.value)} disabled={isTraversing} /> Manual</label>
                </div>
                
                {config.mode === 'random'  ? (
                     <div className="control-group random-controls-group" id = "tour-tree-step-3">
                        <div className="input-pair">
                            <label>Cantidad:</label>
                            <input type="number" value={config.quantity} onChange={(e) => handleConfigChange('quantity', e.target.value)} disabled={isTraversing} />
                        </div>
                        <div className="input-pair">
                            <label>Min:</label>
                            <input type="number" value={config.min} onChange={(e) => handleConfigChange('min', e.target.value)} disabled={isTraversing} />
                        </div>
                         <div className="input-pair">
                            <label>Max:</label>
                            <input type="number" value={config.max} onChange={(e) => handleConfigChange('max', e.target.value)} disabled={isTraversing} />
                        </div>
                        <button className="io-btn" onClick={handleGenerate} disabled={isTraversing}>Generar</button>
                     </div>
                ) : (
                    <div className="control-group" id = "tour-tree-step-4">
                        <button className="io-btn" onClick={() => setIsModalOpen(true)} disabled={isTraversing}>Insertar Nodo</button>
                    </div>
                )}
                 <div className="control-group" id="tour-tree-step-5">
                    <div className="io-buttons">
                        <button className="io-btn" onClick={handleImport} disabled={isTraversing}>Importar</button>
                        <button className="io-btn" onClick={handleExportRequest} disabled={isTraversing}>Exportar</button>
                    </div>
                     <button className="io-btn" onClick={handleReset} style={{backgroundColor: 'var(--rojo-supernova)'}} disabled={isTraversing}>Reset</button>
                </div>
            </div>

            <div className="traversal-result" id="tour-tree-step-6">
                <strong>Recorrido del Árbol:</strong> 
                {traversalResult.length > 0 ? ` ${traversalResult.join(', ')}` : <span className="traversal-result-placeholder">...</span>}
            </div>

            <TreeVisualizer treeData={treeData} highlightedNode={highlightedNode} nodePositions={nodePositions} />

        </div>
    );
};

export default TreeSimulator;