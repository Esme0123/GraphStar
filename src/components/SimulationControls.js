import React, { useState, useEffect } from 'react';

const SimulationControls = ({
  nodes,
  edges,
  onSimulate,
  simulationResult,
  onClear,
  editorMode, // 'johnson' | 'assignment'
}) => {
  /* ==============================
     🔹 SECCIÓN 1: JOHNSON / DIJKSTRA CONTROLS
  ===============================*/
  const isPathMode = editorMode === 'johnson' || editorMode === 'dijkstra';
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState('minimize');
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');

  const handleSimulateClick = () => {
    if (!source || !target) {
      alert('Por favor, selecciona un nodo de origen y uno de destino.');
      return;
    }
    const algorithmType = editorMode === 'dijkstra' ? 'dijkstra' : 'johnson';
    onSimulate({ type: algorithmType, mode, source, target });
  };

  const handleToggleJohnson = () => {
    if (isExpanded) onClear();
    setIsExpanded(!isExpanded);
  };

  /* ==============================
    SECCIÓN 2: ASSIGNMENT CONTROLS
  ===============================*/
  const [assignExpanded, setAssignExpanded] = useState(false);
  const [nodeGroupMap, setNodeGroupMap] = useState({}); // { nodeId: 'agent' | 'task' }
  const [assignObjective, setAssignObjective] = useState('minimize');

  useEffect(() => {
    setNodeGroupMap((prev) => {
      const copy = { ...prev };
      nodes.forEach((n) => {
        if (!copy[n.id]) copy[n.id] = 'agent';
      });
      // Eliminacion de nodos que ya no existen
      Object.keys(copy).forEach((k) => {
        if (!nodes.find((n) => n.id === k)) delete copy[k];
      });
      return copy;
    });
  }, [nodes]);

  const handleAssignToggle = () => {
    if (assignExpanded) onClear();
    setAssignExpanded(!assignExpanded);
  };

  const handleChangeNodeGroup = (nodeId, group) => {
    setNodeGroupMap((prev) => ({ ...prev, [nodeId]: group }));
  };

  const validateAssignmentGraph = () => {
    const agents = [];
    const tasks = [];

    for (const n of nodes) {
      const g = nodeGroupMap[n.id];
      if (g === 'agent') agents.push(n);
      else if (g === 'task') tasks.push(n);
      else {
        alert(`Nodo ${n.data.label} sin grupo asignado.`);
        return false;
      }
    }

    if (agents.length === 0 || tasks.length === 0) {
      alert('Necesitas al menos un agente y una tarea.');
      return false;
    }

    for (const e of edges) {
      const a = nodeGroupMap[e.source];
      const b = nodeGroupMap[e.target];
      if (a === b) {
        alert(`Arista inválida: ${e.source} ↔ ${e.target} conecta nodos del mismo grupo (${a}).`);
        return false;
      }
    }

     // Verificar conectividad básica agente y tarea
  const adjacency = new Map();
  for (const n of nodes) adjacency.set(n.id, []);
  for (const e of edges) {
    if (adjacency.has(e.source)) adjacency.get(e.source).push(e.target);
    if (adjacency.has(e.target)) adjacency.get(e.target).push(e.source);
  }

  for (const ag of agents) {
    const nbrs = adjacency.get(ag.id) || [];
    if (!nbrs.some((nb) => nodeGroupMap[nb] === 'task')) {
      alert(`El agente ${ag.data.label} no tiene aristas hacia ninguna tarea.`);
      return false;
    }
  }

  for (const tk of tasks) {
    const nbrs = adjacency.get(tk.id) || [];
    if (!nbrs.some((nb) => nodeGroupMap[nb] === 'agent')) {
      alert(`La tarea ${tk.data.label} no tiene aristas desde ningún agente.`);
      return false;
    }
  }

    return true;
  };

  const handleRunAssignment = () => {
    if (!validateAssignmentGraph()) return;
    onSimulate({ type: 'assignment', objective: assignObjective, nodeGroupMap });
  };

  /* ==============================*/
  return (
    <>
      {/* --- MODO JOHNSON / DIJKSTRA --- */}
      {isPathMode && (
        <>
          <button
            className={`sidebar-button ${isExpanded ? 'active-mode' : ''}`}
            onClick={handleToggleJohnson}
          >
            {editorMode === 'dijkstra'
              ? '🚀 Simular Ruta (Dijkstra)'
              : '🚀 Simular Ruta (Johnson)'}
          </button>

          {isExpanded && (
            <div className="sidebar-submenu">
              <p className="sidebar-label">Elige una opción:</p>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="minimize">Minimizar (Más Corta)</option>
                <option value="maximize">Maximizar (Más Larga)</option>
              </select>

              <p className="sidebar-label">Desde:</p>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">Selecciona origen...</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.data.label}
                  </option>
                ))}
              </select>

              <p className="sidebar-label">Hasta:</p>
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="">Selecciona destino...</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.data.label}
                  </option>
                ))}
              </select>

              <button className="sidebar-button simulate-button" onClick={handleSimulateClick}>
                🛸 Calcular
              </button>

              {simulationResult && (
                <div className="simulation-result">
                  <p>{simulationResult.text}</p>
                  {simulationResult.path && (
                    <p>Ruta: {simulationResult.path.join(' → ')}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* --- MODO ASSIGNMENT --- */}
      {editorMode === 'assignment' && (
        <>
          <button
            className={`sidebar-button ${assignExpanded ? 'active-mode' : ''}`}
            onClick={handleAssignToggle}
          >
            🤝 Simulación Asignación
          </button>

          {assignExpanded && (
            <div className="sidebar-submenu assignment-submenu">
              <p className="sidebar-label">Objetivo:</p>
              <select
                value={assignObjective}
                onChange={(e) => setAssignObjective(e.target.value)}
              >
                <option value="minimize">Minimizar costo </option>
                <option value="maximize">Maximizar costo </option>
              </select>

              <p className="sidebar-label">Asigna cada nodo a Agente o Tarea:</p>
              <div
                className="assignment-node-list"
                style={{ maxHeight: '240px', overflowY: 'auto' }}
              >
                {nodes.map((n) => (
                  <div key={n.id} className="assignment-node-row">
                    <span style={{ marginRight: 8 }}>{n.data.label}</span>
                    <select
                      value={nodeGroupMap[n.id] || 'agent'}
                      onChange={(e) =>
                        handleChangeNodeGroup(n.id, e.target.value)
                      }
                    >
                      <option value="agent">Agente</option>
                      <option value="task">Tarea</option>
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  className="sidebar-button simulate-button"
                  onClick={handleRunAssignment}
                >
                  ⚖️ Ejecutar Asignación
                </button>
                <button
                  className="sidebar-button"
                  onClick={() => setNodeGroupMap({})}
                >
                  🔁 Reset Grupos
                </button>
                <button
                  className="sidebar-button"
                  onClick={() => {
                    onClear();
                    setAssignExpanded(false);
                  }}
                >
                  ❌ Cerrar
                </button>
              </div>

              {/* Resultados */}
              {simulationResult && simulationResult.assignment && (
                <div
                  className="simulation-result assignment-result"
                  style={{ marginTop: 12 }}
                >
                  <p>{simulationResult.text}</p>

                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    <table className="assignment-table">
                      <thead>
                        <tr>
                          <th>Agente :</th>
                          <th>Tarea</th>
                          <th>= Costo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simulationResult.assignment.map((a, idx) => (
                          <tr key={idx}>
                            <td>{a.agent ? a.agent.data.label : '—'}</td>
                            <td>{a.task ? a.task.data.label : '—'}</td>
                            <td>
                              {a.cost !== null && a.cost !== undefined
                                ? a.cost
                                : a.note || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {simulationResult.matrix && (
                    <div style={{ marginTop: 8 }}>
                      <p>
                        Matriz de costos: (filas = agentes, columnas = tareas):
                      </p>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="cost-matrix">
                          <thead>
                            <tr>
                              <th></th>
                              {simulationResult.matrix.tasks.map((t, j) => (
                                <th key={j}>{t}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {simulationResult.matrix.agents.map(
                              (aLabel, i) => (
                                <tr key={i}>
                                  <td>
                                    <strong>{aLabel}</strong>
                                  </td>
                                  {simulationResult.matrix.values[i].map(
                                    (v, j) => (
                                      <td key={j}>{v}</td>
                                    )
                                  )}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SimulationControls;
