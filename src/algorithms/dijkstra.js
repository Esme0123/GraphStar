const parseEdgeWeight = (edge) => {
  const numeric = parseFloat(edge.label);
  return Number.isFinite(numeric) ? numeric : 0;
};

const createEdgeList = (edges, nodeIndexMap, { reverse = false, transformWeight }) => {
  const list = [];

  edges.forEach((edge) => {
    const sourceId = reverse ? edge.target : edge.source;
    const targetId = reverse ? edge.source : edge.target;

    if (!nodeIndexMap.has(sourceId) || !nodeIndexMap.has(targetId)) {
      return;
    }

    const source = nodeIndexMap.get(sourceId);
    const target = nodeIndexMap.get(targetId);
    const weight = transformWeight(parseEdgeWeight(edge));

    list.push({ source, target, weight });
  });

  return list;
};

const buildAdjacency = (numNodes, edgeList) => {
  const adjacency = Array.from({ length: numNodes }, () => []);

  edgeList.forEach(({ source, target, weight }) => {
    adjacency[source].push({ target, weight });
  });

  return adjacency;
};

const bellmanFordPotentials = (numNodes, edgeList) => {
  const potentials = new Array(numNodes).fill(0);

  for (let i = 0; i < numNodes - 1; i++) {
    let updated = false;

    for (const { source, target, weight } of edgeList) {
      if (potentials[source] + weight < potentials[target]) {
        potentials[target] = potentials[source] + weight;
        updated = true;
      }
    }

    if (!updated) break;
  }

  for (const { source, target, weight } of edgeList) {
    if (potentials[source] + weight < potentials[target]) {
      return { hasNegativeCycle: true, potentials: null };
    }
  }

  return { hasNegativeCycle: false, potentials };
};

const basicDijkstra = (numNodes, adjacency, sourceIndex) => {
  const distances = new Array(numNodes).fill(Infinity);
  const predecessors = new Array(numNodes).fill(-1);
  const visited = new Array(numNodes).fill(false);

  distances[sourceIndex] = 0;

  for (let step = 0; step < numNodes; step++) {
    let u = -1;
    let bestDistance = Infinity;

    for (let i = 0; i < numNodes; i++) {
      if (!visited[i] && distances[i] < bestDistance) {
        bestDistance = distances[i];
        u = i;
      }
    }

    if (u === -1) break;
    visited[u] = true;

    adjacency[u].forEach(({ target, weight }) => {
      const candidate = distances[u] + weight;
      if (candidate < distances[target]) {
        distances[target] = candidate;
        predecessors[target] = u;
      }
    });
  }

  return { distances, predecessors };
};

const runSingleSource = (numNodes, edgeList, sourceIndex) => {
  const hasNegativeEdge = edgeList.some((edge) => edge.weight < 0);

  if (hasNegativeEdge) {
    const { hasNegativeCycle, potentials } = bellmanFordPotentials(numNodes, edgeList);
    if (hasNegativeCycle) {
      return { errorCode: 'NEGATIVE_CYCLE' };
    }

    const reweightedEdges = edgeList.map(({ source, target, weight }) => ({
      source,
      target,
      weight: weight + potentials[source] - potentials[target],
    }));

    const adjacency = buildAdjacency(numNodes, reweightedEdges);
    const { distances: reweightedDistances, predecessors } = basicDijkstra(
      numNodes,
      adjacency,
      sourceIndex
    );

    const distances = reweightedDistances.map((value, index) =>
      value === Infinity ? Infinity : value - potentials[sourceIndex] + potentials[index]
    );

    return { distances, predecessors };
  }

  const adjacency = buildAdjacency(numNodes, edgeList);
  return basicDijkstra(numNodes, adjacency, sourceIndex);
};

const reconstructPath = (predecessors, sourceIndex, targetIndex) => {
  const path = [];
  const visited = new Set();
  let current = targetIndex;

  while (current !== -1 && !visited.has(current)) {
    path.unshift(current);
    if (current === sourceIndex) {
      break;
    }
    visited.add(current);
    current = predecessors[current];
  }

  if (path[0] !== sourceIndex) {
    return [];
  }

  return path;
};

export const runDijkstraAlgorithm = (nodes, edges, { mode = 'minimize', sourceId, targetId }) => {
  if (!nodes.length) {
    return { error: 'Crea al menos dos nodos para ejecutar la simulación.' };
  }

  const nodeIndexMap = new Map(nodes.map((node, index) => [node.id, index]));
  if (!nodeIndexMap.has(sourceId) || !nodeIndexMap.has(targetId)) {
    return { error: 'Selecciona nodos válidos como origen y destino.' };
  }

  const containsNegativeEdge =
    mode === 'minimize' &&
    edges.some((edge) => {
      const weight = parseEdgeWeight(edge);
      return weight < 0;
    });

  if (containsNegativeEdge) {
    return { error: 'Dijkstra requiere pesos no negativos en modo de minimización.' };
  }

  const sourceIndex = nodeIndexMap.get(sourceId);
  const targetIndex = nodeIndexMap.get(targetId);
  const numNodes = nodes.length;
  const transformWeight =
    mode === 'maximize' ? (weight) => -weight : (weight) => weight;

  const forwardEdgeList = createEdgeList(edges, nodeIndexMap, {
    reverse: false,
    transformWeight,
  });
  const forwardResult = runSingleSource(numNodes, forwardEdgeList, sourceIndex);
  if (forwardResult.errorCode === 'NEGATIVE_CYCLE') {
    return {
      error:
        'No se puede maximizar: el grafo contiene un ciclo con ganancia positiva.',
    };
  }

  const convertDistance = (value) =>
    value === Infinity ? Infinity : mode === 'maximize' ? -value : value;

  const costsFromSource = forwardResult.distances.map(convertDistance);
  const finalDistance = costsFromSource[targetIndex];

  if (finalDistance === Infinity) {
    return {
      error: 'No existe una ruta entre los nodos seleccionados.',
    };
  }

  const reverseEdgeList = createEdgeList(edges, nodeIndexMap, {
    reverse: true,
    transformWeight,
  });
  const reverseResult = runSingleSource(numNodes, reverseEdgeList, targetIndex);
  if (reverseResult.errorCode === 'NEGATIVE_CYCLE') {
    return {
      error:
        'No se puede maximizar: el grafo contiene un ciclo con ganancia positiva.',
    };
  }

  const costsToTarget = reverseResult.distances.map(convertDistance);
  const pathNodeIndices = reconstructPath(
    forwardResult.predecessors,
    sourceIndex,
    targetIndex
  );

  return {
    cost: finalDistance,
    pathNodeIndices,
    costsFromSource,
    costsToTarget,
    predecessors: forwardResult.predecessors,
  };
};
