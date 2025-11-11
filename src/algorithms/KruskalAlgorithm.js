// Módulo puro que implementa Kruskal y DSU (Union-Find)
// Exporta la función findMST(nodes, edges, options)

export function findMST(nodes = [], edges = [], options = { mode: 'minimize' }) {
  const mode = options.mode || 'minimize';

  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    return { error: 'Entradas inválidas. Se esperan arrays de nodos y aristas.' };
  }

  const n = nodes.length;
  if (n === 0) return { error: 'No hay nodos en el grafo.' };

  // Mapear node id a índice
  const nodeIds = nodes.map((n) => n.id);
  const nodeIndex = new Map(nodeIds.map((id, i) => [id, i]));

  // Preparar aristas con peso numérico y originalIndex
  const prepared = edges.map((e, i) => {
    const weight = typeof e.weight === 'number' ? e.weight : parseFloat(e.label) || 0;
    return { ...e, weight: weight, originalIndex: i };
  });

  // Ordenar aristas (tie-breaker determinista: peso, luego originalIndex)
  prepared.sort((a, b) => {
    if (mode === 'minimize') {
      if (a.weight !== b.weight) return a.weight - b.weight;
      return a.originalIndex - b.originalIndex;
    }
    if (a.weight !== b.weight) return b.weight - a.weight;
    return a.originalIndex - b.originalIndex;
  });

  // Union-Find
  class DSU {
    constructor(size) {
      this.parent = Array.from({ length: size }, (_, i) => i);
      this.rank = Array(size).fill(0);
    }
    find(x) {
      if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
      return this.parent[x];
    }
    union(x, y) {
      const rx = this.find(x);
      const ry = this.find(y);
      if (rx === ry) return false;
      if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
      else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
      else {
        this.parent[ry] = rx;
        this.rank[rx]++;
      }
      return true;
    }
  }

  const dsu = new DSU(n);
  const mstEdges = [];
  const iterationSteps = [];
  let totalCost = 0;

  let stepCounter = 0;
  for (let i = 0; i < prepared.length; i++) {
    stepCounter++;
    const e = prepared[i];
    const u = nodeIndex.get(e.source);
    const v = nodeIndex.get(e.target);
    if (u === undefined || v === undefined) {
      iterationSteps.push({ step: stepCounter, edge: e, action: 'invalid', reason: 'Nodo desconocido' });
      continue;
    }
    if (dsu.find(u) !== dsu.find(v)) {
      dsu.union(u, v);
      mstEdges.push(e);
      totalCost += e.weight;
      iterationSteps.push({ step: stepCounter, edge: e, action: 'added', reason: 'No forma ciclo' });
    } else {
      iterationSteps.push({ step: stepCounter, edge: e, action: 'rejected', reason: 'Forma un ciclo' });
    }
    if (mstEdges.length === n - 1) break; // MST completo
  }

  // Determinar número de componentes conectadas
  const components = new Set();
  for (let i = 0; i < n; i++) components.add(dsu.find(i));
  const numComponents = components.size;

  if (numComponents > 1) {
    // No es conexo, no existe MST completo que cubra todos los nodos
    return {
      error: `El grafo no es conexo. Componentes detectadas: ${numComponents}`,
      mstEdges: [],
      totalCost: 0,
      iterationSteps,
    };
  }

  return {
    error: null,
    mstEdges,
    totalCost,
    iterationSteps,
  };
}
