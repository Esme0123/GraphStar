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
import SelfConnectingEdge from './components/SelfConnectingEdge';
import WelcomePage from './components/WelcomePage';

import './index.css';

let nodeIdCounter = 0;
const GraphEditor = ({onGoBack}) => {
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
  //const [isSimulating, setIsSimulating] = useState(false);
  
  //funciones necesarias de react flow
  const { getNodes, getEdges, screenToFlowPosition, setViewport, deleteElements } = useReactFlow();
  const nodeTypes = useMemo(() => ({ planet: PlanetNode }), []);
  const edgeTypes = useMemo(() => ({
      selfconnecting: SelfConnectingEdge,
  }), []);
  //lógica de aristas
  
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
  }, [setEdges, isDirected,edgeType]);
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
              <button id="tour-step-1" className="sidebar-button" onClick={onAddNode}>🪐 Crear Nodo</button>
              <button id="tour-step-2"
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
  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomePage 
                  onGoToEditor={() => setCurrentView('editor')} 
                  onGoBack={() => setCurrentView('loading')} 
                />;
      case 'editor':
        return (
          <div className="graph-editor visible">
            <ReactFlowProvider>
              {}
              <GraphEditor onGoBack={() => setCurrentView('welcome')} />
            </ReactFlowProvider>
          </div>
        );
      case 'loading':
      default:
        return <LoadingScreen onStart={() => setCurrentView('welcome')} />;
    }
  };
  return (
    <>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      {renderView()}
    </>
  );
}

export default App;