import React, { useState, useCallback, useMemo, useEffect, Fragment } from 'react';
import ReactFlow, {
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
import SelfConnectingEdge from './components/SelfConnectingEdge';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import ModeSelectionModal from './components/ModeSelectionModal';
import TutorialModal from './components/TutorialModal';
import TourGuide from './components/TourGuide';
import { runJohnsonAlgorithm } from './algorithms/johnson';
import SimulationControls from './components/SimulationControls';
import PathWithSlackEdge from './components/PathWithSlackEdge';

import './index.css';
const tutorials = {
  //home: 'ID_DEL_VIDEO_HOMEPAGE',       
  welcome: 'AsJia0nKSRg',    
  //editorPizarra: 'ID_DEL_VIDEO_PIZARRA', 
  editorJohnson: 'bhdYIWRa6ug', 
};
let nodeIdCounter = 0;
const GraphEditor = ({mode,onGoBack,showTutorial}) => {
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
  const [edgeType, setEdgeType] = useState('default');
  //tour
  const[runTour, setRunTour] =useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  //funciones necesarias de react flow
  const { getNodes, getEdges, screenToFlowPosition, setViewport, deleteElements } = useReactFlow();
  const nodeTypes = useMemo(() => ({ planet: PlanetNode }), []);
  const edgeTypes = useMemo(() => ({
      selfconnecting: SelfConnectingEdge,
      pathWithSlack: PathWithSlackEdge, 
  }), []);
  //tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('graphStarTourSeen');
    if (!hasSeenTour) {
      setRunTour(true);
      localStorage.setItem('graphStarTourSeen', 'true');
    }
  }, []);
  useEffect(() => {
    if (mode === 'johnson') {
      showTutorial('editorJohnson');
    } /*else {
      showTutorial('editorPizarra');
    }*/
  }, [mode]);
  const startTour = () => {
    setRunTour(true);
  };
  //lógica de aristas
  const onConnect = useCallback((params) => {
      if (mode === 'johnson') {
        //sin loops
        if (params.source === params.target) {
          alert("Modo Johnson: No se permiten los bucles (auto-conexiones).");
          return;
        }
        //sin conexiones inversas
        const reverseEdgeExists = edges.some(
          (edge) => edge.source === params.target && edge.target === params.source
        );
        if (reverseEdgeExists) {
          alert("Modo Johnson: No se permiten conexiones bidireccionales.");
          return;
        }
      }
      const value = prompt("Ingresa el valor de la arista (opcional):");
      if (mode === 'johnson' && value) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue < 0) {
            alert("Modo Johnson: No se permiten pesos negativos.");
            return;
        }
      }
      const newEdge = {
          ...params,
          id: `edge_${params.source}_${params.target}_${new Date().getTime()}`,
          label: value || '',
          labelStyle: { fontSize: 16, fill: 'var(--amarillo-estrella)', fontWeight: 'bold' },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: 'var(--azul-nebuloso)', fillOpacity: 0.8 },
          style: { stroke: 'var(--verde-estelar)', strokeWidth: 2 }, 
          markerEnd: isDirected 
            ? { type: 'arrowclosed', color: 'var(--verde-estelar)', width: 15, height: 15 } 
            : undefined,
      };
      if (params.source === params.target) {
        newEdge.type = 'selfconnecting';
      }else{
        newEdge.type=edgeType;
      }
      setIsAddingEdge(false);
      setEdges((eds) => eds.concat(newEdge));
  }, [edges,setEdges, isDirected,edgeType,mode]);
  //si cambia a dirigido
  useEffect(() => {
      setEdges((eds) =>
          eds.map((e) => ({
              ...e,
              markerEnd: isDirected ? { type: 'arrowclosed', color: e.style?.stroke ||'var(--verde-estelar)',width: 15, height: 15} : undefined,
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
  const handleSimulate = ({ mode, source, target }) => {
    // aristas con el peso correcto
    if (mode === 'minimize' && edges.some(edge => parseFloat(edge.label) < 0)) {
        alert("Error: No se puede ejecutar la minimización si el grafo contiene pesos negativos.");
        return;
    }
    const edgePairs = new Set();
    for (const edge of edges) {
        const forwardPair = `${edge.source}-${edge.target}`;
        const reversePair = `${edge.target}-${edge.source}`;
        if (edgePairs.has(reversePair)) {
            alert("Error: No se puede ejecutar el algoritmo si existen conexiones bidireccionales (ej: A->B y B->A).");
            return; 
        }
        edgePairs.add(forwardPair);
    }
    clearHighlight();
    const preparedEdges = edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        label: edge.label,
        weight: (parseFloat(edge.label) || 0) * (mode === 'maximize' ? -1 : 1)
    }));
    // llamar algoritmo
    const { distances, predecessors, error } = runJohnsonAlgorithm(nodes, preparedEdges);

    if (error) {
        setSimulationResult({ text: `Error: ${error}` });
        return;
    }
    // procesar resultado
    const sourceIndex = nodes.findIndex(n => n.id === source);
    const targetIndex = nodes.findIndex(n => n.id === target);
    let finalDistance = distances[sourceIndex][targetIndex];
    if (finalDistance === Infinity) {
      setSimulationResult({ text: `No existe ruta desde ${nodes[sourceIndex].data.label} hasta ${nodes[targetIndex].data.label}.` });
      return;
    }
    
    const costsFromSource = distances[sourceIndex];
    const cumulativeCostMap = new Map();
    
    if (mode === 'maximize') {
      finalDistance *= -1;
    }
    //reconstruir
    const pathNodeIndices = [];
    let currentNodeIndex = targetIndex;
    while (currentNodeIndex !== -1 && currentNodeIndex !== undefined) {
        pathNodeIndices.unshift(currentNodeIndex);
        if (pathNodeIndices.length > nodes.length) {
            console.error("Error en la reconstrucción de la ruta, posible ciclo.");
            return;
        }
        currentNodeIndex = predecessors[sourceIndex][currentNodeIndex];
    }
    const pathNodeIds = pathNodeIndices.map(index => nodes[index].id);
    const pathLabels = pathNodeIndices.map(index => nodes[index].data.label);
    pathNodeIds.forEach((nodeId, i) => {
        const nodeIdx = nodes.findIndex(n => n.id === nodeId);
        cumulativeCostMap.set(nodeId, costsFromSource[nodeIdx]);
    });
    const pathEdgeIds = new Set();
    for (let i = 0; i < pathNodeIds.length - 1; i++) {
        const edge = edges.find(e => e.source === pathNodeIds[i] && e.target === pathNodeIds[i + 1]);
        if (edge) pathEdgeIds.add(edge.id);
    }
    const slackMap = new Map();
    const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));
    edges.forEach(edge => {
      const u_idx = nodeMap.get(edge.source);
      const v_idx = nodeMap.get(edge.target);
      const weight = (parseFloat(edge.label) || 0) * (mode === 'maximize' ? -1 : 1);
      const slack = costsFromSource[v_idx] - (costsFromSource[u_idx] + weight);
      slackMap.set(edge.id, slack);
    });
    setNodes(nds => 
      nds.map(node => ({
        ...node,
        data: {
          ...node.data,
          cumulativeCost: cumulativeCostMap.get(node.id),
          isMaximize: mode === 'maximize' 
        }
      }))
    );
    // resaltar aristas en grafo
    setEdges(eds => 
      eds.map(e => ({
        ...e,
        className: pathEdgeIds.has(e.id) ? 'highlighted-edge' : '',
        type: 'pathWithSlack', 
        animated: pathEdgeIds.has(e.id),
        data: { ...e.data, slack: slackMap.get(e.id) },
        style: { stroke: 'var(--verde-estelar)', strokeWidth: 2 }
      }))
    );
    const resultText = `Costo del camino más ${mode === 'minimize' ? 'corto' : 'largo'}: ${finalDistance.toFixed(2)}`;
    setSimulationResult({ text: resultText, path: pathLabels });
  };
  const clearHighlight = () => {
    setSimulationResult(null);
    setNodes(nds => 
      nds.map(node => {
        const { cumulativeCost,isMaximize, ...restData } = node.data;
        return { ...node, data: restData };
      })
    );
    setEdges(eds => 
      eds.map(e => {
        const { slack, ...restData } = e.data || {};
        return {
          ...e,
          className: '',
          type: 'default', 
          animated: false,
          data: restData,
          style: {
            ...e.style,
            stroke: 'var(--verde-estelar)',
            strokeWidth: 2
          }
        };
      })
    );
  };
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
const onSaveEdgeChanges = (edgeId, data) => {
  setEdges((eds) =>
      eds.map((e) => {
          if (e.id === edgeId) {
              return { ...e, label: data.label,style:{...e.style, stroke: data.color} };
          }
          return e;
      })
  );
  setEditingEdge(null); 
};
const processedEdges = useMemo(() => {
    const edgesWithCurvature = new Map();
    edges.forEach(edge => {
        const sourceTargetId = isDirected ? `${edge.source}-${edge.target}` : [edge.source, edge.target].sort().join('-');
        if (edgesWithCurvature.has(sourceTargetId)) {
            edgesWithCurvature.get(sourceTargetId).push(edge);
        } else {
            edgesWithCurvature.set(sourceTargetId, [edge]);
        }
    });
    return edges.map(edge => {
      const sourceTargetId = isDirected ? `${edge.source}-${edge.target}` : [edge.source, edge.target].sort().join('-');
      const group = edgesWithCurvature.get(sourceTargetId);
      if (group.length > 1) {
        const edgeIndex = group.findIndex(e => e.id === edge.id);
        if (edge.source === edge.target) {
                return {
                    ...edge,
                    data: { ...edge.data, loopIndex: edgeIndex }, // Pasamos un índice al componente
                };
            }
        const totalEdges = group.length;
        const curvature = (edgeIndex - (totalEdges - 1) / 2) * 0.4;
        if (edge.type === 'default' || !edge.type) {
            return {
                ...edge,
                pathOptions: {
                    curvature: curvature,
                },
            };
        }
      }
      return edge;
    });
  }, [edges, isDirected]);

  return (
      <Fragment>
          {editingEdge && 
            <EdgeEditModal 
                edge={editingEdge} 
                onSave={onSaveEdgeChanges} 
                onCancel={() => setEditingEdge(null)} 
                mode={mode} 
            />
          }
          {editingNode && 
          <NodeEditModal 
                node={editingNode} 
                onSave={onSaveNodeChanges} 
                onCancel={() => setEditingNode(null)} />}
          {showMatrix&& <AdjacencyMatrixModal 
                nodes={nodes}
                matrix={adjacencyMatrix}
                onClose={() => setShowMatrix(false)}
            />}
            <TourGuide run={runTour} onTourEnd={()=>setRunTour(false)}/>
            <button onClick={startTour} className="help-button" title="Mostrar tutorial">
            ?
            </button>
          <MainHeader />
          <div className="sidebar-container">
              <button id="btn-add-node" className="sidebar-button" onClick={onAddNode}>🪐 Crear Nodo</button>
              <button id="btn-add-edge"
                className={`sidebar-button ${isAddingEdge ? 'active-mode' : ''}`}
                onClick={()=>setIsAddingEdge(prev=>!prev)}>⛓️‍💥 Agregar Arista</button>
              {isAddingEdge && (
                <div className="sidebar-submenu">
                    <p className="sidebar-label">Elige un estilo:</p>
                    <div className="sidebar-button-group">
                        <button 
                            className={`sidebar-button-small ${edgeType === 'default' ? 'active' : ''}`}
                            onClick={() => setEdgeType('default')}>↩️ Curva</button>
                        <button 
                            className={`sidebar-button-small ${edgeType === 'straight' ? 'active' : ''}`}
                            onClick={() => setEdgeType('straight')}>⬆️ Recta</button>
                        <button 
                            className={`sidebar-button-small ${edgeType === 'smoothstep' ? 'active' : ''}`}
                            onClick={() => setEdgeType('smoothstep')}>⤵️ Suave</button>
                    </div>
                </div>
            )}
              <button id="btn-delete" className="sidebar-button" onClick={onDeleteElements}>🗑️ Eliminar Seleccionado</button>
              <button id="btn-show-matrix" className="sidebar-button" onClick={showAdjacencyMatrix}>📊 Matriz de Adyacencia</button>
              <hr className="sidebar-separator" />
              <label className="checkbox-container" id="cb-directed">
                  <input id="directed-checkbox" type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} />
                  Grafo Dirigido
              </label>
              {mode === 'johnson' && (
              <>
                <hr className="sidebar-separator" />
                <div className="simulation" id="btn-simulation-bar">
                  <SimulationControls 
                  nodes={nodes} 
                  onSimulate={handleSimulate}
                  simulationResult={simulationResult}
                  onClear={clearHighlight}
                  />
                </div>
              </>
              )}
              <hr className="sidebar-separator" />
              <button id="btn-save" className="sidebar-button" onClick={onSave}>💾 Guardar Grafo</button>
              <button id="btn-load" className="sidebar-button" onClick={onLoad}>📂 Cargar Grafo</button>
              <button id="btn-reset" className="sidebar-button" onClick={onReset}>🔄 Limpiar Pizarra</button>
          </div>
          <ReactFlow
              nodes={nodes}
              edges={processedEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDoubleClick={onNodeDoubleClick}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              connectionMode="loose"
              className={isAddingEdge ? 'adding-edge-mode' : ''}
              onEdgeDoubleClick={onEdgeDoubleClick}
              edgeTypes={edgeTypes}
          >
              <Controls showInteractive={false} />
          </ReactFlow>
          <button className="back-button-editor" onClick={onGoBack} title="Volver a la Bienvenida">
              ↩️
          </button>
      </Fragment>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [editorMode, setEditorMode] = useState('pizarra');
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(null);
  const showTutorial = (section) => {
    const videoId = tutorials[section];
    if (videoId && videoId.startsWith('ID_')) {
      console.warn(`Video de tutorial para '${section}' no configurado.`);
      return;
    }
    setActiveTutorial(videoId);
  };
  const navigateTo = (view) => {
    setCurrentView(view);
  };
  const handleSelectMode = (mode) => {
    setEditorMode(mode);
    setIsModeModalOpen(false);
    navigateTo('editor'); 
  };
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={navigateTo} /*showTutorial={showTutorial}*/ />;
      case 'welcome':
        return <WelcomePage 
                  onGoToEditor={() => setIsModeModalOpen(true)} 
                  onGoBack={() => navigateTo('home')} 
                  showTutorial={showTutorial}
                />;
      case 'editor':
        return (
          <div className="graph-editor visible">
            <ReactFlowProvider>
              <GraphEditor mode={editorMode} onGoBack={() => navigateTo('welcome')} 
                showTutorial={showTutorial} />
            </ReactFlowProvider>
          </div>
        );
      case 'loading':
      default:
        return <LoadingScreen onStart={() => navigateTo('home')} />;
    }
  };
  return (
    <>
      {currentView !== 'home' && (
        <>
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </>
      )}
      {isModeModalOpen && 
        <ModeSelectionModal 
          onSelectMode={handleSelectMode} 
          onClose={() => setIsModeModalOpen(false)} 
        />
      }
      <TutorialModal 
        videoId={activeTutorial} 
        onClose={() => setActiveTutorial(null)} 
      />
      {renderView()}
    </>
  );
}

export default App;