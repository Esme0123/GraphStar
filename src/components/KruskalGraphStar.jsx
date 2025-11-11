import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, { Controls, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

import MainHeader from './MainHeader';
import NodeEditModal from './NodeEditModal';
import EdgeEditModal from './EdgeEditModal';
import PlanetNode from './PlanetNode';
import SelfConnectingEdge from './SelfConnectingEdge';
import PathWithSlackEdge from './PathWithSlackEdge';

import { findMST } from '../algorithms/KruskalAlgorithm';
import '../index.css';

// Componente KruskalGraphStar: copia adaptada de la pizarra original, estilizada con las clases existentes
const KruskalGraphStar = ({ onGoBack }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDirected, setIsDirected] = useState(false);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [edgeSourceNode, setEdgeSourceNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  const { screenToFlowPosition, getNodes, getEdges, deleteElements } = useReactFlow() || {};

  const nodeTypes = useMemo(() => ({ planet: PlanetNode }), []);
  const edgeTypes = useMemo(() => ({ selfconnecting: SelfConnectingEdge, pathWithSlack: PathWithSlackEdge }), []);

  useEffect(() => {
    // show basic tutorial or instructions if needed
  }, []);

  const onAddNode = useCallback(() => {
    const label = prompt('Ingresa el nombre del nuevo planeta:');
    if (label) {
      const position = { x: window.innerWidth / 2 - 200 + Math.random() * 200, y: window.innerHeight / 2 - 100 + Math.random() * 200 };
      const newNode = {
        id: `node_${Date.now()}`,
        type: 'planet',
        data: { label, color: '#6A4C93', size: 80 },
        position,
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [setNodes]);

  const onConnect = useCallback((params) => {
    // Cuando el usuario conecta, añadimos la arista y abrimos el modal de edición para capturar el peso
    const newEdge = {
      ...params,
      id: `edge_${params.source}_${params.target}_${Date.now()}`,
      label: '',
      weight: 0,
      style: { stroke: 'var(--verde-estelar)', strokeWidth: 2 },
      markerEnd: isDirected ? { type: 'arrowclosed', color: 'var(--verde-estelar)' } : undefined,
    };
    // Si self-loop
    if (params.source === params.target) newEdge.type = 'selfconnecting';
    setEdges((eds) => eds.concat(newEdge));
    // Abrir modal de edición para capturar label/peso utilizando el mismo componente existente
    setEditingEdge(newEdge);
    setIsAddingEdge(false);
  }, [isDirected, setEdges]);

  const onNodeDoubleClick = useCallback((event, node) => setEditingNode(node), []);

  const onNodeClick = useCallback((event, node) => {
    if (!isAddingEdge) return;
    if (!edgeSourceNode) {
      setEdgeSourceNode(node);
      alert(`Nodo '${node.data.label}' seleccionado como origen. Ahora haz clic en un nodo destino.`);
    } else {
      onConnect({ source: edgeSourceNode.id, target: node.id });
      setIsAddingEdge(false);
      setEdgeSourceNode(null);
    }
  }, [isAddingEdge, edgeSourceNode, onConnect]);

  const onSaveNodeChanges = (nodeId, data) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, label: data.label, color: data.color, size: data.size } } : n));
    setEditingNode(null);
  };

  const onSaveEdgeChanges = (edgeId, data) => {
    // Guardar label y peso (weight) - reutilizando el componente EdgeEditModal
    setEdges((eds) => eds.map((e) => {
      if (e.id === edgeId) {
        const parsedWeight = parseFloat(data.label);
        return { ...e, label: data.label, weight: isNaN(parsedWeight) ? 0 : parsedWeight, style: { ...e.style, stroke: data.color } };
      }
      return e;
    }));
    setEditingEdge(null);
  };

  const onEdgeDoubleClick = useCallback((event, edge) => setEditingEdge(edge), []);

  const onDeleteElements = () => {
    const selectedNodes = getNodes().filter(n => n.selected);
    const selectedEdges = getEdges().filter(e => e.selected);
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      if (window.confirm('¿Confirmas la eliminación de los elementos seleccionados?')) {
        deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      }
    } else {
      alert('Selecciona un nodo o arista para eliminar.');
    }
  };

  const onReset = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el universo?')) {
      setNodes([]);
      setEdges([]);
    }
  }, [setNodes, setEdges]);

  const applyKruskal = () => {
    // Kruskal requiere grafo no dirigido
    if (isDirected) {
      alert('Algoritmo de Kruskal requiere un grafo NO dirigido. Desactiva "Grafo Dirigido" y vuelve a intentar.');
      return;
    }
    if (nodes.length < 2) {
      alert('Se necesitan al menos 2 nodos para calcular un MST.');
      return;
    }
    if (edges.length === 0) {
      alert('Se necesitan aristas para calcular un MST.');
      return;
    }

    // llamar al módulo puro
    const result = findMST(nodes, edges, { mode: 'minimize' });
    if (result.error) {
      setSimulationResult({ text: `Error: ${result.error}` });
      return;
    }
    // Debug: log MST edge ids para inspección y reproducibilidad
    try {
      console.log('Kruskal result.mstEdges IDs:', result.mstEdges.map(e => e.id));
      console.log('Kruskal result.mstEdges (detailed):', result.mstEdges);
      console.log('Kruskal total cost:', result.totalCost);
    } catch (err) {
      console.warn('Kruskal debug log failed:', err);
    }

    // Resaltar aristas del MST reutilizando la clase .highlighted-edge ya definida en index.css
    const mstEdgeIds = new Set(result.mstEdges.map(e => e.id));
    // Mapear estilos y luego reordenar para que las aristas resaltadas se dibujen al final (por encima)
    setEdges((eds) => {
      const mapped = eds.map((e) => ({
        ...e,
        className: mstEdgeIds.has(e.id) ? 'highlighted-edge' : '',
        style: {
          ...e.style,
          strokeWidth: mstEdgeIds.has(e.id) ? 6 : (e.style?.strokeWidth || 2),
          stroke: mstEdgeIds.has(e.id) ? 'var(--highlight-edge)' : (e.style?.stroke || 'var(--verde-estelar)'),
          strokeLinecap: mstEdgeIds.has(e.id) ? 'round' : (e.style?.strokeLinecap || 'butt'),
        }
      }));

      // Para asegurar que las aristas resaltadas se muestran por encima, las colocamos al final del array
      const highlighted = mapped.filter(e => mstEdgeIds.has(e.id));
      const others = mapped.filter(e => !mstEdgeIds.has(e.id));
      return [...others, ...highlighted];
    });

  setSimulationResult({ text: `🌳 MST calculado - Costo total: ${result.totalCost.toFixed(2)}`, iterationSteps: result.iterationSteps, mstInfo: { totalCost: result.totalCost, edgesCount: result.mstEdges.length }, mstEdgeIds: result.mstEdges.map(e => e.id) });
  };

  const clearHighlight = () => {
    setSimulationResult(null);
    setEdges((eds) => eds.map((e) => ({ ...e, className: '', style: { ...e.style, stroke: 'var(--verde-estelar)', strokeWidth: 2 } })));
  };

  return (
    <div className="kruskal-graphstar-root">
      <MainHeader />
      {/* Botón de ayuda: abre el manual PDF de Kruskal (mismo patrón que en TransportePage) */}
      <button
        id="kruskal-manual-help"
        type="button"
        className="help-button"
        title="Abrir Manual de Kruskal"
        onClick={() => window.open('/manuals/Kruskal_Manual.pdf', '_blank')}
      >
        ?
      </button>
      <div className="sidebar-container">
        <button id="btn-add-node" className="sidebar-button" onClick={onAddNode}>🪐 Crear Nodo</button>
        <button id="btn-add-edge" className={`sidebar-button ${isAddingEdge ? 'active-mode' : ''}`} onClick={() => setIsAddingEdge(prev => !prev)}>⛓️ Agregar Arista</button>
        {isAddingEdge && (
          <div className="sidebar-submenu">
            <p className="sidebar-label">Elige un estilo:</p>
            <div className="sidebar-button-group">
              <button className="sidebar-button-small" onClick={() => { /* estilo por defecto */ }}>↩️ Curva</button>
              <button className="sidebar-button-small" onClick={() => { /* recta */ }}>⬆️ Recta</button>
              <button className="sidebar-button-small" onClick={() => { /* suave */ }}>⤵️ Suave</button>
            </div>
            <p className="sidebar-note">Al crear la arista se abrirá un modal para ingresar su peso.</p>
          </div>
        )}
        <button id="btn-delete" className="sidebar-button" onClick={onDeleteElements}>🗑️ Eliminar Seleccionado</button>
        <button id="btn-show-matrix" className="sidebar-button" onClick={() => alert('Matriz no implementada en esta vista.')}>📊 Matriz de Adyacencia</button>
        <hr className="sidebar-separator" />
        <label className="checkbox-container" id="cb-directed">
          <input id="directed-checkbox" type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} />
          Grafo Dirigido
        </label>

        <hr className="sidebar-separator" />
        {/* Botón aplicar Kruskal - reutiliza clase sidebar-button */}
        <button id="btn-apply-kruskal" className="sidebar-button" onClick={applyKruskal}>🌳 Aplicar Kruskal</button>

        <button id="btn-reset" className="sidebar-button" onClick={onReset}>🔄 Limpiar Pizarra</button>
        <button id="btn-back" className="sidebar-button" onClick={onGoBack}>↩️ Volver</button>

        {simulationResult && (
          <div className="sidebar-submenu simulation-result" style={{ marginTop: 12 }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{simulationResult.text}</p>
            {simulationResult.iterationSteps && simulationResult.iterationSteps.length > 0 && (
              <div style={{ maxHeight: 180, overflowY: 'auto', marginTop: 8 }}>
                <table style={{ width: '100%', fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>Paso</th>
                      <th>Arista</th>
                      <th>Peso</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationResult.iterationSteps.map((s, i) => (
                      <tr key={i} style={{ backgroundColor: s.action === 'added' ? 'rgba(0,249,160,0.05)' : 'rgba(233,69,96,0.05)' }}>
                        <td>{s.step}</td>
                        <td style={{ fontSize: 11 }}>{s.edge ? `${s.edge.source} → ${s.edge.target}` : '—'}</td>
                        <td style={{ color: 'var(--amarillo-estrella)' }}>{s.edge ? (s.edge.weight ?? 0).toFixed(2) : '—'}</td>
                        <td style={{ color: s.action === 'added' ? 'var(--verde-estelar)' : 'var(--rojo-peligro)' }}>{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <button className="sidebar-button" onClick={clearHighlight}>❌ Limpiar Resultado</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeClick={onNodeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode="loose"
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Modales reutilizados */}
      {editingEdge && (
        <EdgeEditModal edge={editingEdge} onSave={onSaveEdgeChanges} onCancel={() => setEditingEdge(null)} mode={'kruskal'} />
      )}

      {editingNode && (
        <NodeEditModal node={editingNode} onSave={onSaveNodeChanges} onCancel={() => setEditingNode(null)} />
      )}
    </div>
  );
};

export default function KruskalGraphStarWrapper(props) {
  return (
    <ReactFlowProvider>
      <KruskalGraphStar {...props} />
    </ReactFlowProvider>
  );
}
