import React, { useState, useCallback, useMemo, useEffect, Fragment } from 'react';
import ReactFlow, {
    addEdge,
    Controls,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import LoadingScreen from './components/LoadingScreen';
import MainHeader from './components/MainHeader';
import NodeEditModal from './components/NodeEditModal';
import PlanetNode from './components/PlanetNode';
import EdgeEditModal from './components/EdgeEditModal';
import AdjacencyMatrixModal from './components/AdjacencyMatrixModal';

import './index.css';

let nodeIdCounter = 0;
const GraphEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDirected, setIsDirected] = useState(false);
  //crear aristas
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [edgeSourceNode, setEdgeSourceNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState(null);
  
  //funciones necesarias de react flow
  const { getNodes, getEdges, screenToFlowPosition, setViewport, deleteElements } = useReactFlow();
  const nodeTypes = useMemo(() => ({ planet: PlanetNode }), []);
  //lógica de aristas
  const startAddEdgeMode = () => {
      setIsAddingEdge(true);
      setEdgeSourceNode(null);
      alert("Modo 'Agregar Arista' activado. Haz clic en un nodo de origen.");
  };
  const onConnect = useCallback((params) => {
      const value = prompt("Ingresa el valor de la arista (opcional):");
      const newEdge = {
          ...params,
          id: `edge_${params.source}_${params.target}_${new Date().getTime()}`,
          label: value || '',
          labelStyle: { fontSize: 16, fill: 'var(--amarillo-estrella)', fontWeight: 'bold' },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: 'var(--azul-nebuloso)', fillOpacity: 0.8 },
          style: { stroke: 'var(--verde-estelar)', strokeWidth: 3 }, 
          markerEnd: isDirected 
            ? { type: 'arrowclosed', color: 'var(--verde-estelar)', width: 25, height: 25 } 
            : undefined,
      };
      setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges, isDirected]);
  //si cambia a dirigido
  useEffect(() => {
      setEdges((eds) =>
          eds.map((e) => ({
              ...e,
              markerEnd: isDirected ? { type: 'arrowclosed', color: 'var(--verde-estelar)',width: 25, height: 25} : undefined,
          }))
      );
  }, [isDirected, setEdges]);
  //nodos
  const onAddNode = useCallback(() => {
      const label = prompt("Ingresa el nombre del nuevo planeta:");
      if (label) {
          const position = screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
          });
          const newNode = {
              id: `node_${nodeIdCounter++}`,
              type: 'planet',
              data: { label, color: '#6A4C93', size: 80 },
              position,
          };
          setNodes((nds) => nds.concat(newNode));
      }
  }, [screenToFlowPosition, setNodes]);
  
  const onNodeDoubleClick = useCallback((event, node) => setEditingNode(node), []);
  
  const onNodeClick = useCallback((event, node) => {
      if (!isAddingEdge) return;

      if (!edgeSourceNode) {
          setEdgeSourceNode(node);
          alert(`Nodo '${node.data.label}' seleccionado como origen. Ahora haz clic en un nodo de destino.`);
      } else {
          onConnect({ source: edgeSourceNode.id, target: node.id });
          setIsAddingEdge(false);
          setEdgeSourceNode(null);
      }
  }, [isAddingEdge, edgeSourceNode, onConnect]);

  const onSaveNodeChanges = (nodeId, data) => {
      setNodes((nds) =>
          nds.map((n) => {
              if (n.id === nodeId) {
                  return {
                      ...n,
                      data: { ...n.data, label: data.label, color: data.color, size: data.size },
                  };
              }
              return n;
          })
      );
      setEditingNode(null);
  };
  const showAdjacencyMatrix = () => {
    const nodes = getNodes();
    const edges = getEdges();
    if (nodes.length === 0) {
        alert("No hay planetas en el universo para generar una matriz.");
        return;
    }
    const nodeIndexMap = new Map();
    nodes.forEach((node, index) => {
        nodeIndexMap.set(node.id, index);
    });
    const matrix = Array(nodes.length).fill(0).map(() => Array(nodes.length).fill(0));
    edges.forEach(edge => {
        const sourceIndex = nodeIndexMap.get(edge.source);
        const targetIndex = nodeIndexMap.get(edge.target);
        if (sourceIndex !== undefined && targetIndex !== undefined) {
            const weight = parseInt(edge.label, 10) || 1;
            matrix[sourceIndex][targetIndex] = weight;
            if (!isDirected) {
                matrix[targetIndex][sourceIndex] = weight;
            }
        }
    });
    setAdjacencyMatrix(matrix);
    setShowMatrix(true);
};

  const simulate = () => alert("Funcionalidad 'Simular' próximamente...");
  
  const onDeleteElements = () => {
      const selectedNodes = getNodes().filter(n => n.selected);
      const selectedEdges = getEdges().filter(e => e.selected);
      if (selectedNodes.length > 0 || selectedEdges.length > 0) {
         if (window.confirm("¿Confirmas la eliminación de los elementos seleccionados?")) {
             deleteElements({ nodes: selectedNodes, edges: selectedEdges });
         }
      } else {
          alert("Selecciona un nodo o arista para eliminar.");
      }
  };

  const onReset = useCallback(() => {
      if (window.confirm("¿Estás seguro de que quieres borrar todo el universo?")) {
          setNodes([]);
          setEdges([]);
          setViewport({ x: 0, y: 0, zoom: 1 });
      }
  }, [setNodes, setEdges, setViewport]);

  const onSave = useCallback(() => {
      const graphName = prompt("Asigna un nombre a tu universo:", "mi-universo");
      if (!graphName) return;
      const graphData = { nodes: getNodes(), edges: getEdges() };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(graphData, null, 2))}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `${graphName}.json`;
      link.click();
  }, [getNodes, getEdges]);

  const onLoad = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (event) => {
          const file = event.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const data = JSON.parse(e.target.result);
                  if (data && data.nodes && data.edges) {
                      setNodes(data.nodes);
                      setEdges(data.edges);
                  } else { alert("Archivo JSON no válido."); }
              } catch (error) { alert("Error al leer el archivo."); }
          };
          reader.readAsText(file);
      };
      input.click();
  };

  const onEdgeDoubleClick = useCallback((event, edge) => {
    setEditingEdge(edge);
}, []);
const onSaveEdgeChanges = (edgeId, newLabel) => {
  setEdges((eds) =>
      eds.map((e) => {
          if (e.id === edgeId) {
              return { ...e, label: newLabel };
          }
          return e;
      })
  );
  setEditingEdge(null); 
};

  return (
      <Fragment>
          {editingNode && 
          <NodeEditModal 
                node={editingNode} 
                onSave={onSaveNodeChanges} 
                onCancel={() => setEditingNode(null)} />}
          <EdgeEditModal 
                edge={editingEdge}
                onSave={onSaveEdgeChanges}
                onCancel={() => setEditingEdge(null)}
            />
          {showMatrix&& <AdjacencyMatrixModal 
                nodes={getNodes()}
                matrix={adjacencyMatrix}
                onClose={() => setShowMatrix(false)}
            />}
          <MainHeader />
          <div className="sidebar-container">
              <button className="sidebar-button" onClick={onAddNode}>🪐 Crear Nodo</button>
              <button className={`sidebar-button ${isAddingEdge ? 'active-mode' : ''}`} onClick={startAddEdgeMode}>⛓️‍💥 Agregar Arista</button>
              <button className="sidebar-button" onClick={onDeleteElements}>🗑️ Eliminar Seleccionado</button>
              <hr className="sidebar-separator" />
              <label className="checkbox-container">
                  <input type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} />
                  Grafo Dirigido
              </label>
              <hr className="sidebar-separator" />
              <button className="sidebar-button" onClick={showAdjacencyMatrix}>📊 Matriz de Adyacencia</button>
              <button className="sidebar-button" onClick={simulate}>🚀 Simular</button>
              <hr className="sidebar-separator" />
              <button className="sidebar-button" onClick={onSave}>💾 Guardar Grafo</button>
              <button className="sidebar-button" onClick={onLoad}>📂 Cargar Grafo</button>
              <button className="sidebar-button" onClick={onReset}>🔄 Limpiar Pizarra</button>
          </div>
          <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDoubleClick={onNodeDoubleClick}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              connectionMode="loose"
              className={isAddingEdge ? 'adding-edge-mode' : ''}
              onEdgeDoubleClick={onEdgeDoubleClick}
          >
              <Controls showInteractive={false} />
          </ReactFlow>
      </Fragment>
  );
};

function App() {
  const [isStarted, setIsStarted] = useState(false);
  return (
      <>
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
          {!isStarted ? 
              <LoadingScreen onStart={() => setIsStarted(true)} /> : 
              (
                  <div className="graph-editor visible">
                      <ReactFlowProvider>
                          <GraphEditor />
                      </ReactFlowProvider>
                  </div>
              )
          }
      </>
  );
}

export default App;