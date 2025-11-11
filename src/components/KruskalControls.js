import React, { useState } from 'react';

const KruskalControls = ({
  nodes,
  edges,
  onSimulate,
  simulationResult,
  onClear,
  isDirected,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState('minimize');
  const [showIterations, setShowIterations] = useState(false);

  const handleToggle = () => {
    if (isExpanded) onClear();
    setIsExpanded(!isExpanded);
  };

  const handleSimulateClick = () => {
    // Validación: Kruskal requiere grafo NO dirigido
    if (isDirected) {
      alert('⚠️ Algoritmo de Kruskal: El grafo debe ser NO DIRIGIDO (sin flechas).\n\nDesactiva la opción "Grafo Dirigido" en el menú lateral y vuelve a intentar.');
      return;
    }

    // Validación: Al menos 2 nodos
    if (nodes.length < 2) {
      alert('❌ Error: Se necesitan al menos 2 nodos para calcular un árbol de expansión mínima.');
      return;
    }

    // Validación: Al menos 1 arista
    if (edges.length === 0) {
      alert('❌ Error: Se necesitan aristas para calcular un árbol de expansión mínima.');
      return;
    }

    // Ejecutar algoritmo
    onSimulate({ type: 'kruskal', mode });
  };

  return (
    <>
      <button
        className={`sidebar-button ${isExpanded ? 'active-mode' : ''}`}
        onClick={handleToggle}
        title="Ejecutar Algoritmo de Kruskal para MST"
      >
        🌳 Kruskal (MST)
      </button>

      {isExpanded && (
        <div className="sidebar-submenu kruskal-submenu">
          {/* Advertencia si está dirigido */}
          {isDirected && (
            <div style={{
              backgroundColor: 'var(--rojo-peligro)',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '12px',
              fontSize: '12px',
              color: 'var(--blanco-estelar)',
              textAlign: 'center'
            }}>
              ⚠️ Grafo Dirigido Detectado
            </div>
          )}

          {/* Selector de modo */}
          <p className="sidebar-label">Objetivo:</p>
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)}
            className="kruskal-select"
          >
            <option value="minimize">Minimizar (MST de menor costo)</option>
            <option value="maximize">Maximizar (MST de mayor costo)</option>
          </select>

          {/* Información */}
          <div style={{
            backgroundColor: 'var(--azul-nebuloso)',
            padding: '8px',
            borderRadius: '4px',
            marginTop: '12px',
            marginBottom: '12px',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            <p style={{ margin: '0 0 4px 0' }}>
              📌 <strong>Algoritmo de Kruskal</strong>
            </p>
            <p style={{ margin: '0 0 4px 0' }}>
              Encuentra el árbol de expansión mínima ordenando aristas por peso.
            </p>
            <p style={{ margin: '0' }}>
              Nodos: {nodes.length} | Aristas: {edges.length}
            </p>
          </div>

          {/* Botones de acción */}
          <button 
            className="sidebar-button simulate-button" 
            onClick={handleSimulateClick}
            style={{ width: '100%' }}
          >
            🚀 Calcular MST
          </button>

          {/* Resultado */}
          {simulationResult && (
            <div className="simulation-result kruskal-result" style={{ marginTop: '12px' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                ✅ {simulationResult.text}
              </p>

              {/* Información del resultado */}
              {simulationResult.mstInfo && (
                <div style={{
                  backgroundColor: 'var(--azul-nebuloso)',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  fontSize: '12px'
                }}>
                  <p style={{ margin: '4px 0' }}>
                    🌳 Aristas en MST: <strong>{simulationResult.mstInfo.numEdgesInMST}/{simulationResult.mstInfo.numNodes - simulationResult.mstInfo.numComponents}</strong>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    🔗 Componentes: <strong>{simulationResult.mstInfo.numComponents}</strong>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    💰 Costo Total: <strong style={{ color: 'var(--amarillo-estrella)' }}>
                      {simulationResult.mstInfo.totalCost.toFixed(2)}
                    </strong>
                  </p>
                </div>
              )}

              {/* Toggle para mostrar iteraciones */}
              {simulationResult.iterationSteps && simulationResult.iterationSteps.length > 0 && (
                <>
                  <button
                    className="sidebar-button"
                    onClick={() => setShowIterations(!showIterations)}
                    style={{
                      width: '100%',
                      fontSize: '12px',
                      padding: '6px'
                    }}
                  >
                    {showIterations ? '▼' : '▶'} Detalles de Iteraciones ({simulationResult.iterationSteps.length})
                  </button>

                  {showIterations && (
                    <div style={{
                      marginTop: '8px',
                      maxHeight: '280px',
                      overflowY: 'auto',
                      backgroundColor: 'rgba(46, 59, 78, 0.5)',
                      borderRadius: '4px',
                      padding: '8px',
                      fontSize: '11px'
                    }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left'
                      }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--verde-estelar)' }}>
                            <th style={{ padding: '4px', color: 'var(--verde-estelar)' }}>Paso</th>
                            <th style={{ padding: '4px', color: 'var(--verde-estelar)' }}>Arista</th>
                            <th style={{ padding: '4px', color: 'var(--verde-estelar)' }}>Peso</th>
                            <th style={{ padding: '4px', color: 'var(--verde-estelar)' }}>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {simulationResult.iterationSteps.map((step, idx) => (
                            <tr
                              key={idx}
                              style={{
                                backgroundColor: step.action === 'added' 
                                  ? 'rgba(0, 249, 160, 0.1)' 
                                  : 'rgba(233, 69, 96, 0.1)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <td style={{ padding: '4px' }}>
                                {step.action === 'added' ? '✅' : '❌'} {step.step}
                              </td>
                              <td style={{ padding: '4px', fontSize: '10px' }}>
                                {step.edgeLabel}
                              </td>
                              <td style={{ 
                                padding: '4px',
                                color: 'var(--amarillo-estrella)'
                              }}>
                                {step.weight.toFixed(1)}
                              </td>
                              <td style={{ 
                                padding: '4px',
                                fontSize: '10px',
                                color: step.action === 'added' ? 'var(--verde-estelar)' : 'var(--rojo-peligro)'
                              }}>
                                {step.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* Botón de limpiar */}
              <button
                className="sidebar-button"
                onClick={() => {
                  onClear();
                  setIsExpanded(false);
                  setShowIterations(false);
                }}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  backgroundColor: 'var(--rojo-peligro)',
                  fontSize: '12px',
                  padding: '6px'
                }}
              >
                ❌ Limpiar Resultado
              </button>
            </div>
          )}

          {/* Botón para cerrar sin resultado */}
          {!simulationResult && (
            <button
              className="sidebar-button"
              onClick={() => {
                setIsExpanded(false);
              }}
              style={{
                width: '100%',
                marginTop: '8px',
                fontSize: '12px',
                padding: '6px'
              }}
            >
              ❌ Cerrar
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default KruskalControls;
