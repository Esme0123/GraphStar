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
        if (newNode.value === node.value) return; 

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
    // --- MÉTODOS DE RECONSTRUCCIÓN ---
    /**
     * Reconstruye un árbol binario a partir de los recorridos In-Order y Post-Order.
     * @param {Array<number>} inOrder - Arreglo del recorrido In-Order.
     * @param {Array<number>} postOrder - Arreglo del recorrido Post-Order.
     * @returns {BinarySearchTree} - Una nueva instancia del árbol reconstruido.
     */
    static fromInPost(inOrder, postOrder) {
        if (!inOrder || !postOrder || inOrder.length === 0 || inOrder.length !== postOrder.length) {
            throw new Error("Los arreglos In-Order y Post-Order deben existir y tener la misma longitud.");
        }
        
        const inOrderMap = new Map();
        inOrder.forEach((val, index) => inOrderMap.set(val, index));
        
        // El último elemento de Post-Order es la raíz
        let postIndex = postOrder.length - 1;

        function buildTree(inStart, inEnd) {
            // Caso base
            if (inStart > inEnd) return null;

            // Obtener la raíz actual del final del arreglo Post-Order
            const rootVal = postOrder[postIndex];
            postIndex--; // Mover el índice al siguiente "padre"
            const rootNode = new TreeNode(rootVal);
            
            // Encontrar la raíz en In-Order para saber qué es izquierda y qué es derecha
            const inIndex = inOrderMap.get(rootVal);
            if (inIndex === undefined) {
                throw new Error(`El valor ${rootVal} de Post-Order no se encontró en In-Order. ¿Hay duplicados?`);
            }            // IMPORTANTE: Construir el subárbol DERECHO primero,
            // porque estamos consumiendo el arreglo Post-Order desde el final.
            rootNode.right = buildTree(inIndex + 1, inEnd);
            // Construir el subárbol izquierdo
            rootNode.left = buildTree(inStart, inIndex - 1);

            return rootNode;
        }

        const tree = new BinarySearchTree();
        tree.root = buildTree(0, inOrder.length - 1);
        
        if (postIndex !== -1) {
             throw new Error("El arreglo Post-Order no se consumió completamente. Verifique si hay duplicados o valores inválidos.");
        }
        return tree;
    }

    /**
     * Reconstruye un árbol binario a partir de los recorridos In-Order y Pre-Order.
     * @param {Array<number>} inOrder - Arreglo del recorrido In-Order.
     * @param {Array<number>} preOrder - Arreglo del recorrido Pre-Order.
     * @returns {BinarySearchTree} - Una nueva instancia del árbol reconstruido.
     */
    static fromInPre(inOrder, preOrder) {
        if (!inOrder || !preOrder || inOrder.length === 0 || inOrder.length !== preOrder.length) {
            throw new Error("Los arreglos In-Order y Pre-Order deben existir y tener la misma longitud.");
        }
        
        const inOrderMap = new Map();
        inOrder.forEach((val, index) => inOrderMap.set(val, index));
        
        // El primer elemento de Pre-Order es la raíz
        let preIndex = 0;

        function buildTree(inStart, inEnd) {
            // Caso base
            if (inStart > inEnd) return null;

            // Obtener la raíz actual del inicio del arreglo Pre-Order
            const rootVal = preOrder[preIndex];
            preIndex++; // Mover el índice a la siguiente raíz (del subárbol izquierdo)
            const rootNode = new TreeNode(rootVal);

            // Encontrar la raíz en In-Order
            const inIndex = inOrderMap.get(rootVal);
            if (inIndex === undefined) {
                throw new Error(`El valor ${rootVal} de Pre-Order no se encontró en In-Order. ¿Hay duplicados?`);
            }

            // Construir el subárbol izquierdo
            rootNode.left = buildTree(inStart, inIndex - 1);
            // Construir el subárbol derecho
            rootNode.right = buildTree(inIndex + 1, inEnd);

            return rootNode;
        }

        const tree = new BinarySearchTree();
        tree.root = buildTree(0, inOrder.length - 1);
        
        if (preIndex !== preOrder.length) {
             throw new Error("El arreglo Pre-Order no se consumió completamente. Verifique si hay duplicados o valores inválidos.");
        }
        return tree;
    }

    /**
     * --- ¡NUEVO MÉTODO! ---
     * Reconstruye un árbol binario a partir de los recorridos Pre-Order y Post-Order.
     * @param {Array<number>} preOrder - Arreglo del recorrido Pre-Order.
     * @param {Array<number>} postOrder - Arreglo del recorrido Post-Order.
     * @returns {BinarySearchTree} - Una nueva instancia del árbol reconstruido.
     */
    static fromPrePost(preOrder, postOrder) {
        if (!preOrder || !postOrder || preOrder.length === 0 || preOrder.length !== postOrder.length) {
            throw new Error("Los arreglos Pre-Order y Post-Order deben existir y tener la misma longitud.");
        }
        
        const postOrderMap = new Map();
        postOrder.forEach((val, index) => postOrderMap.set(val, index));        
        // El primer elemento de Pre-Order es la raíz
        let preIndex = 0;
        function buildTree(postStart, postEnd) {
            if (postStart > postEnd) return null;

            const rootVal = preOrder[preIndex];
            preIndex++; 
            const rootNode = new TreeNode(rootVal);

            if (postStart === postEnd) {
                if (postOrder[postStart] !== rootVal) {
                     throw new Error("Inconsistencia en los datos de Pre-Order y Post-Order (hoja).");
                }
                return rootNode;
            }

            const nextRootVal = preOrder[preIndex];

            if (nextRootVal < rootVal) {
                
                const postLeftRootIndex = postOrderMap.get(nextRootVal);
                
                if (postLeftRootIndex === undefined) {
                    throw new Error(`El valor ${nextRootVal} de Pre-Order no se encontró en Post-Order. ¿Hay duplicados?`);
                }
                if (postLeftRootIndex < postStart || postLeftRootIndex > postEnd - 1) {
                    throw new Error(`Inconsistencia en los límites del árbol para el valor ${nextRootVal}.`);
                }

                rootNode.left = buildTree(postStart, postLeftRootIndex);
                rootNode.right = buildTree(postLeftRootIndex + 1, postEnd - 1);

            } else {
                // El siguiente nodo es un HIJO DERECHO (ya que nextRootVal > rootVal).
                // Esto implica que NO HAY HIJO IZQUIERDO.-1
                rootNode.left = null; // Asignamos null a la izquierda
                rootNode.right = buildTree(postStart, postEnd - 1); // Construimos la derecha
            }

            return rootNode;
        }

        const tree = new BinarySearchTree();
        tree.root = buildTree(0, postOrder.length - 1);
        
        if (preIndex !== preOrder.length) {
             throw new Error("El arreglo Pre-Order no se consumió completamente. Verifique si hay duplicados o valores inválidos.");
        }
        return tree;
    }
}
// // --- Componentes de React ---
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
        
        .traversal-btn.active {
            background-color: var(--verde-galactico);
            color: var(--negro-cosmico);
            box-shadow: 0 0 15px var(--verde-galactico);
        }
        .traversal-btn:hover:not(.active) {
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

        /* --- NUEVOS ESTILOS PARA RECONSTRUCCIÓN --- */
        .reconstruction-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding: 20px;
            background-color: rgba(44, 62, 80, 0.5);
            border-radius: 15px;
            border: 1px solid var(--verde-galactico);
            width: 100%;
            max-width: 800px;
            color: var(--blanco-estelar);
        }

        .reconstruct-method-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: stretch; /* Estirar items para que tengan el mismo ancho */
        }
        .reconstruct-method-group h3 {
            font-family: var(--font-title);
            margin: 0;
            text-align: center;
            font-size: 1.2rem;
            margin-bottom: 5px;
        }
        .reconstruct-method-group label {
            background-color: rgba(0,0,0,0.3);
            border: 1px solid var(--verde-galactico);
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: var(--font-text);
        }
        .reconstruct-method-group input[type="radio"] {
             margin-right: 10px;
             /* Estilo para el botón de radio */
             accent-color: var(--verde-galactico);
        }
         .reconstruct-method-group label:has(input:checked) {
            background-color: var(--verde-galactico);
            color: var(--negro-cosmico);
            font-weight: bold;
            box-shadow: 0 0 10px var(--verde-galactico);
        }
        /* Estilo para la nota de advertencia */
        .reconstruct-method-group label small {
            display: inline-block; /* Para que el margen funcione */
            margin-left: 28px; /* Alinear con el texto después del radio */
            opacity: 0.8;
            font-weight: normal;
            font-size: 0.85rem;
        }

        .reconstruct-input-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
            max-width: 500px;
        }
        .reconstruct-input-group .input-pair {
            align-items: flex-start; /* Alinear labels a la izquierda */
            width: 100%;
        }
        .reconstruct-input-group label {
             margin-bottom: 5px;
             font-family: var(--font-title);
             font-size: 1.1rem;
             color: var(--verde-galactico);
        }

        .traversal-input {
            background-color: var(--negro-cosmico);
            color: var(--blanco-estelar);
            border: 1px solid var(--verde-galactico);
            border-radius: 5px;
            padding: 10px;
            width: 100%;
            font-family: var(--font-text);
            font-size: 1.1rem;
            box-sizing: border-box; /* Importante para width: 100% */
        }
        .traversal-input::placeholder {
            color: #777;
        }

    `}</style>
);

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
// --- COMPONENTE MODIFICADO PARA EL PANEL DE RECONSTRUCCIÓN ---
const TreeReconstructionPanel = ({ onTreeReconstructed, showNotification }) => {
    const [reconstructMode, setReconstructMode] = useState('in-post'); // 'in-post', 'in-pre' o 'pre-post'
    const [inOrderStr, setInOrderStr] = useState('');
    const [postOrderStr, setPostOrderStr] = useState('');
    const [preOrderStr, setPreOrderStr] = useState('');

    /**
     * Parsea un string de números (separados por coma o espacio) a un arreglo de números.
     */
    const parseInput = (str) => {
        return str.split(/[\s,]+/) // Separar por comas o espacios
                  .filter(s => s.trim() !== '') // Quitar strings vacíos
                  .map(s => parseInt(s, 10)) // Convertir a número
                  .filter(val => !isNaN(val)); // Quitar cualquier "NaN" resultante
    };

    const handleReconstruct = () => {
        
        try {
            let newTree;

            if (reconstructMode === 'in-post') {
                const inOrder = parseInput(inOrderStr);
                const postOrder = parseInput(postOrderStr);
                if (inOrder.length === 0 || postOrder.length === 0) {
                    showNotification("Los recorridos In Order y Post Order no pueden estar vacíos.");
                    return;
                }
                if (inOrder.length !== postOrder.length) {
                     showNotification("Los recorridos In Order y Post Order deben tener la misma longitud.");
                     return;
                }
                newTree = BinarySearchTree.fromInPost(inOrder, postOrder);

            } else if (reconstructMode === 'in-pre') { 
                const inOrder = parseInput(inOrderStr);
                const preOrder = parseInput(preOrderStr);
                 if (inOrder.length === 0 || preOrder.length === 0) {
                    showNotification("Los recorridos In Order y Pre Order no pueden estar vacíos.");
                    return;
                }
                if (inOrder.length !== preOrder.length) {
                     showNotification("Los recorridos In Order y Pre Order deben tener la misma longitud.");
                     return;
                }
                newTree = BinarySearchTree.fromInPre(inOrder, preOrder);

            } else { // 'pre-post'
                const preOrder = parseInput(preOrderStr);
                const postOrder = parseInput(postOrderStr);
                if (preOrder.length === 0 || postOrder.length === 0) {
                    showNotification("Los recorridos Pre Order y Post Order no pueden estar vacíos.");
                    return;
                }
                if (preOrder.length !== postOrder.length) {
                     showNotification("Los recorridos Pre Order y Post Order deben tener la misma longitud.");
                     return;
                }
                showNotification("Iniciando reconstrucción Pre+Post... (Puede ser ambigua si el árbol no es 'lleno')");
                newTree = BinarySearchTree.fromPrePost(preOrder, postOrder);
            }

            onTreeReconstructed(newTree.serialize()); // Pasar el árbol serializado al componente padre
            showNotification("Árbol reconstruido exitosamente. 🎉");
        } catch (error) {
            showNotification(`Error: ${error.message}`);
            console.error("Error en reconstrucción:", error);
        }
    };

    return (
        <div className="reconstruction-container" id="tour-reconstruct-1">
            <h1 className="simulator-title">Reconstructor de Árboles</h1>
            <div className="reconstruct-method-group">
                <h3>Método de Reconstrucción</h3>
                <label>
                    <input 
                        type="radio" 
                        value="in-post" 
                        checked={reconstructMode === 'in-post'} 
                        onChange={() => setReconstructMode('in-post')} 
                    />
                    IN ORDER + POST ORDER
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="in-pre" 
                        checked={reconstructMode === 'in-pre'} 
                        onChange={() => setReconstructMode('in-pre')} 
                    />
                    IN ORDER + PRE ORDER
                </label>
                {/* --- NUEVA OPCIÓN --- */}
                <label>
                    <input 
                        type="radio" 
                        value="pre-post" 
                        checked={reconstructMode === 'pre-post'} 
                        onChange={() => setReconstructMode('pre-post')} 
                    />
                    PRE ORDER + POST ORDER
                    <br />
                </label>
            </div>
            <div className="reconstruct-input-group">
                {reconstructMode !== 'pre-post' && (
                    <div className="input-pair">
                        <label>IN ORDER:</label>
                        <input 
                            type="text" 
                            value={inOrderStr} 
                            onChange={(e) => setInOrderStr(e.target.value)}
                            placeholder="Ej: 2, 3, 5, 8, 15"
                            className="traversal-input"
                        />
                    </div>
                )}
                
                {/* Mostrar PRE ORDER si es 'in-pre' o 'pre-post' */}
                {reconstructMode !== 'in-post' && (
                     <div className="input-pair">
                        <label>PRE ORDER:</label>
                        <input 
                            type="text" 
                            value={preOrderStr} 
                            onChange={(e) => setPreOrderStr(e.target.value)}
                            placeholder="Ej: 8, 3, 2, 5, 15"
                            className="traversal-input"
                        />
                    </div>
                )}

                {/* Mostrar POST ORDER si es 'in-post' o 'pre-post' */}
                {reconstructMode !== 'in-pre' && (
                    <div className="input-pair">
                        <label>POST ORDER:</label>
                        <input 
                            type="text" 
                            value={postOrderStr} 
                            onChange={(e) => setPostOrderStr(e.target.value)}
                            placeholder="Ej: 2, 5, 3, 15, 8"
                            className="traversal-input"
                        />
                    </div>
                )}
            </div>
            
            <button className="io-btn" onClick={handleReconstruct} style={{padding: '12px 25px', fontSize: '1rem'}}>
                Reconstruir Árbol
            </button>
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
    
    // --- ESTADOS MODIFICADOS ---
    const [appMode, setAppMode] = useState('simulator'); // 'simulator' o 'reconstructor'
    const [isTraversing, setIsTraversing] = useState(false);
    const [traversalType, setTraversalType] = useState(''); // Solo para el modo 'simulator'
    // ---
    
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
        if (isTraversing || !treeInstance.root) {
            if (!treeInstance.root) showNotification("El árbol está vacío. Genere o inserte nodos primero.");
            return;
        }
        stopTraversal();
        setTraversalResult([]);
        setTraversalType(type); // Setea el tipo de recorrido para la clase 'active'

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
                    setAppMode('simulator'); // Volver al modo simulador al importar
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
                {/* Botón adicional: abrir manual PDF de NorthWest */}
            <button
            type="button"
            className="pdf-button" 
            title="Abrir Manual de Árboles"
            onClick={() => window.open('/manuals/Tree_Manual.html', '_blank')}
            >
            📄
            </button>
            
            {/* Los botones de navegación ahora controlan appMode */}
            <div className="traversal-buttons" id= "tour-tree-step-1">
                <button 
                    className={`traversal-btn ${appMode === 'simulator' && traversalType === 'IN ORDER' ? 'active' : ''}`} 
                    onClick={() => {
                        setAppMode('simulator');
                        handleStartTraversal('IN ORDER');
                    }} 
                    disabled={isTraversing}>IN ORDER</button>
                <button 
                    className={`traversal-btn ${appMode === 'simulator' && traversalType === 'POST ORDER' ? 'active' : ''}`} 
                    onClick={() => {
                        setAppMode('simulator');
                        handleStartTraversal('POST ORDER');
                    }} 
                    disabled={isTraversing}>POST ORDER</button>
                <button 
                    className={`traversal-btn ${appMode === 'simulator' && traversalType === 'PRE ORDER' ? 'active' : ''}`} 
                    onClick={() => {
                        setAppMode('simulator');
                        handleStartTraversal('PRE ORDER');
                    }} 
                    disabled={isTraversing}>PRE ORDER</button>
                <button 
                    className={`traversal-btn ${appMode === 'reconstructor' ? 'active' : ''}`} 
                    onClick={() => {
                        stopTraversal();
                        handleReset(); // Limpiar el árbol al cambiar a reconstruir
                        setAppMode('reconstructor');
                    }} 
                    disabled={isTraversing}>RECONSTRUIR</button>
            </div>
            
            {/* Renderizado condicional basado en appMode */}
            {appMode === 'simulator' ? (
                <>
                    <h1 className="simulator-title">Simulador de Árboles</h1>
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
                </>
            ) : (
                <TreeReconstructionPanel 
                    onTreeReconstructed={(newTreeData) => {
                        // Esta función de callback actualiza el estado principal
                        const newTree = BinarySearchTree.fromSerialized(newTreeData);
                        setTreeInstance(newTree);
                        setTreeData(newTreeData);
                        setTraversalResult([]); // Limpiar resultados de recorridos antiguos
                    }}
                    showNotification={showNotification}
                />
            )}

            <TreeVisualizer treeData={treeData} highlightedNode={highlightedNode} nodePositions={nodePositions} />

        </div>
    );
};

export default TreeSimulator;