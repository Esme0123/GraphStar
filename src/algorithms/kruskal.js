/**
 * Algoritmo de Kruskal - Árbol de Expansión Mínima (MST)
 * 
 * Implementación pura sin dependencias de UI
 * Retorna el MST, el costo total y metadata para visualización
 */

class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.size = Array(n).fill(1);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false; // Ya están en el mismo conjunto

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }

    return true; // Unión exitosa
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

/**
 * Ejecuta el algoritmo de Kruskal
 * 
 * @param {Array} nodes - Array de nodos con estructura: { id, data: { label, ... } }
 * @param {Array} edges - Array de aristas con estructura: { source, target, label (peso), ... }
 * @param {Object} options - Opciones: { mode: 'minimize'|'maximize' }
 * @returns {Object} { mstEdges, totalCost, error, iterationSteps }
 */
export const runKruskalAlgorithm = (nodes, edges, options = { mode: 'minimize' }) => {
  const mode = options.mode || 'minimize';

  // Validaciones básicas
  if (!nodes || nodes.length === 0) {
    return { error: 'No hay nodos en el grafo' };
  }

  if (!edges || edges.length === 0) {
    return { 
      error: 'No hay aristas en el grafo',
      mstEdges: [],
      totalCost: 0,
      iterationSteps: []
    };
  }

  // Crear mapeo de IDs a índices
  const nodeIds = nodes.map(n => n.id);
  const nodeMap = new Map(nodeIds.map((id, i) => [id, i]));

  // Validar que todas las aristas tengan nodos válidos
  for (const edge of edges) {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
      return { 
        error: `Arista inválida: ${edge.source} -> ${edge.target}` 
      };
    }
  }

  // Detectar si el grafo no dirigido tiene componentes conectadas
  const adj = new Map();
  nodeIds.forEach(id => adj.set(id, []));
  
  for (const edge of edges) {
    adj.get(edge.source).push(edge.target);
    adj.get(edge.target).push(edge.source); // No dirigido
  }

  // BFS para contar componentes conectadas
  const visited = new Set();
  let numComponents = 0;
  
  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      numComponents++;
      const queue = [nodeId];
      visited.add(nodeId);
      
      while (queue.length > 0) {
        const u = queue.shift();
        for (const v of adj.get(u)) {
          if (!visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
        }
      }
    }
  }

  // PASO 1: Preparar aristas con pesos
  const preparedEdges = edges
    .map((edge, index) => {
      const weight = parseFloat(edge.label) || 0;
      return {
        ...edge,
        index: index,
        originalIndex: index,
        weight: weight,
        displayWeight: weight
      };
    });

  // PASO 2: Ordenar aristas por peso (Kruskal)
  const sortedEdges = [...preparedEdges].sort((a, b) => {
    return a.weight - b.weight;
  });

  // PASO 3: Union-Find para detectar ciclos
  const uf = new UnionFind(nodes.length);
  const mstEdges = [];
  let totalCost = 0;
  const iterationSteps = [];

  // Rastrear el proceso paso a paso para visualización
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const sourceIndex = nodeMap.get(edge.source);
    const targetIndex = nodeMap.get(edge.target);

    // Verificar si agregar esta arista crearía un ciclo
    if (!uf.connected(sourceIndex, targetIndex)) {
      // Agregar arista al MST
      uf.union(sourceIndex, targetIndex);
      mstEdges.push({
        ...edge,
        id: edge.id,
        inMST: true
      });
      totalCost += edge.weight;

      iterationSteps.push({
        step: mstEdges.length,
        edgeId: edge.id,
        edgeLabel: `${nodes[sourceIndex].data.label} → ${nodes[targetIndex].data.label}`,
        weight: edge.weight,
        totalCost: totalCost,
        action: 'added',
        reason: 'No forma ciclo'
      });
    } else {
      // Ciclo detectado, no agregar
      iterationSteps.push({
        step: iterationSteps.length + 1,
        edgeId: edge.id,
        edgeLabel: `${nodes[sourceIndex].data.label} → ${nodes[targetIndex].data.label}`,
        weight: edge.weight,
        totalCost: totalCost,
        action: 'rejected',
        reason: 'Forma un ciclo'
      });
    }

    // MST completo si tenemos n-1 aristas
    if (mstEdges.length === nodes.length - 1) {
      break;
    }
  }

  // Validar que el grafo es conexo
  if (mstEdges.length < nodes.length - numComponents) {
    return {
      error: `El grafo no es conexo. Tiene ${numComponents} componentes. Árbol de expansión mínima solo existe para grafos conexos.`,
      mstEdges: [],
      totalCost: 0,
      iterationSteps: []
    };
  }

  return {
    mstEdges,
    totalCost,
    error: null,
    iterationSteps,
    numEdgesInMST: mstEdges.length,
    numNodes: nodes.length,
    numComponents: numComponents,
    isComplete: mstEdges.length === nodes.length - 1
  };
};

/**
 * Versión alternativa: Algoritmo de Prim (también genera MST)
 * Incluida para comparación educativa
 */
export const runPrimAlgorithm = (nodes, edges, options = { mode: 'minimize', startNode: null }) => {
  const mode = options.mode || 'minimize';
  
  if (!nodes || nodes.length === 0) {
    return { error: 'No hay nodos en el grafo' };
  }

  if (!edges || edges.length === 0) {
    return { 
      error: 'No hay aristas en el grafo',
      mstEdges: [],
      totalCost: 0
    };
  }

  const nodeIds = nodes.map(n => n.id);
  const nodeMap = new Map(nodeIds.map((id, i) => [id, i]));

  // Validar nodos
  for (const edge of edges) {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
      return { error: `Arista inválida: ${edge.source} -> ${edge.target}` };
    }
  }

  // Construir lista de adyacencia
  const adj = new Map();
  nodeIds.forEach(id => adj.set(id, []));

  const edgeMap = new Map();
  for (const edge of edges) {
    const weight = parseFloat(edge.label) || 0;
    adj.get(edge.source).push({ nodeId: edge.target, weight, edge });
    adj.get(edge.target).push({ nodeId: edge.source, weight, edge });
    edgeMap.set(`${edge.source}__${edge.target}`, edge);
    edgeMap.set(`${edge.target}__${edge.source}`, edge);
  }

  // Punto de inicio por defecto
  let startNodeId = options.startNode || nodeIds[0];
  if (!nodeMap.has(startNodeId)) {
    startNodeId = nodeIds[0];
  }

  const mstEdges = [];
  const visited = new Set([startNodeId]);
  const pq = []; // Priority queue simulada (array ordenado)
  let totalCost = 0;

  // Agregar todas las aristas del nodo inicial
  for (const { nodeId, weight, edge } of adj.get(startNodeId)) {
    if (!visited.has(nodeId)) {
      pq.push({ weight, nodeId, edge });
    }
  }

  while (pq.length > 0 && visited.size < nodes.length) {
    pq.sort((a, b) => a.weight - b.weight);
    const { weight, nodeId, edge } = pq.shift();

    if (visited.has(nodeId)) continue;

    visited.add(nodeId);
    mstEdges.push(edge);
    totalCost += weight;

    // Agregar nuevas aristas
    for (const { nodeId: nextId, weight: nextWeight, edge: nextEdge } of adj.get(nodeId)) {
      if (!visited.has(nextId)) {
        pq.push({ weight: nextWeight, nodeId: nextId, edge: nextEdge });
      }
    }
  }

  const isConnected = visited.size === nodes.length;

  return {
    mstEdges,
    totalCost,
    error: isConnected ? null : 'El grafo no es conexo',
    numEdgesInMST: mstEdges.length,
    numNodes: nodes.length,
    isComplete: mstEdges.length === nodes.length - 1 && isConnected
  };
};
