export function runAssignmentAlgorithm(nodes, edges, options = { mode: 'minimize', padWithZero: true }) {
  const mode = options.mode || 'minimize';
  const padWithZero = options.padWithZero ?? true;

  const adj = new Map();
  nodes.forEach(n => adj.set(n.id, new Set()));
  edges.forEach(e => {
   
    if (!adj.has(e.source) || !adj.has(e.target)) return;
    adj.get(e.source).add(e.target);
    adj.get(e.target).add(e.source);
  });

  // 1) Comprobar bipartito por BFS y obtener dos conjuntos
  const color = new Map(); 
  const agents = [];
  const tasks = [];
  for (const start of nodes.map(n => n.id)) {
    if (color.has(start)) continue;
    // BFS
    const queue = [start];
    color.set(start, 0);
    while (queue.length) {
      const u = queue.shift();
      const c = color.get(u);
      for (const v of adj.get(u)) {
        if (!color.has(v)) {
          color.set(v, 1 - c);
          queue.push(v);
        } else if (color.get(v) === c) {
          return { error: 'El grafo NO es bipartito. Deben existir solo aristas entre los dos conjuntos (agentes vs tareas).' };
        }
      }
    }
  }
  for (const n of nodes) {
    if (color.get(n.id) === 0) agents.push(n);
    else tasks.push(n);
  }
  //validacion de aristas pertenecients al same grupio
  for (const e of edges) {
    if (color.get(e.source) === color.get(e.target)) {
      return { error: 'Existe una arista entre nodos del mismo conjunto (no es permitido en asignación bipartita).' };
    }
  }
  const hasEdgeFromAgent = new Map(); // nodeId -> boolean
  const hasEdgeToTask = new Map();
  agents.forEach(a => hasEdgeFromAgent.set(a.id, false));
  tasks.forEach(t => hasEdgeToTask.set(t.id, false));
  edges.forEach(e => {
    if (hasEdgeFromAgent.has(e.source) && hasEdgeToTask.has(e.target)) {
      hasEdgeFromAgent.set(e.source, true);
      hasEdgeToTask.set(e.target, true);
    }
    // también aceptar si las aristas están en sentido inverso (depende de cómo construyes el grafo)
    if (hasEdgeFromAgent.has(e.target) && hasEdgeToTask.has(e.source)) {
      hasEdgeFromAgent.set(e.target, true);
      hasEdgeToTask.set(e.source, true);
    }
  });
  for (const [id, ok] of hasEdgeFromAgent.entries()) {
    if (!ok) return { error: `El agente '${id}' no tiene aristas hacia ninguna tarea.` };
  }
  for (const [id, ok] of hasEdgeToTask.entries()) {
    if (!ok) return { error: `La tarea '${id}' no puede ser asignada (no tiene aristas).` };
  }

  // 4) Construir matriz de costes: filas = agentes, columnas = tareas
  const agentIds = agents.map(a => a.id);
  const taskIds = tasks.map(t => t.id);
  const nRows = agentIds.length;
  const nCols = taskIds.length;
  const n = Math.max(nRows, nCols); // tamaño para cuadrar
  const INF = 1e12;

  // Inicializa matriz n x n
  const costMatrix = Array(n).fill(0).map(() => Array(n).fill(0));

  const edgeMap = new Map();
  edges.forEach(e => {
    const key = `${e.source}__${e.target}`;
    const weight = (typeof e.label !== 'undefined' && e.label !== null && e.label !== '') ? parseFloat(e.label) : 0;
    if (!isNaN(weight)) edgeMap.set(key, weight);
    // también guardar reverse por si el grafo lo tenía invertido
    edgeMap.set(`${e.target}__${e.source}`, weight);
  });

  // Llenar submatriz [0..nRows-1][0..nCols-1]
  for (let i = 0; i < nRows; i++) {
    for (let j = 0; j < nCols; j++) {
      const key1 = `${agentIds[i]}__${taskIds[j]}`;
      const key2 = `${taskIds[j]}__${agentIds[i]}`; // por si la arista está en otro sentido
      let w;
      if (edgeMap.has(key1)) w = edgeMap.get(key1);
      else if (edgeMap.has(key2)) w = edgeMap.get(key2);
      else w = INF; // no hay arista => evitar esa asignación
      costMatrix[i][j] = w;
    }
  }
  if (nRows < n) {
    for (let i = nRows; i < n; i++) {
      for (let j = 0; j < n; j++) costMatrix[i][j] = padWithZero ? 0 : INF;
    }
  }
  if (nCols < n) {
    for (let i = 0; i < n; i++) {
      for (let j = nCols; j < n; j++) costMatrix[i][j] = padWithZero ? 0 : INF;
    }
  }

  let transformed = costMatrix.map(row => row.slice());
  if (mode === 'maximize') {
    // Convertimos a minimización: restamos cada coste al maxCost
    let maxCost = -Infinity;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (Math.abs(transformed[i][j]) < INF/2) maxCost = Math.max(maxCost, transformed[i][j]);
    // Si todos eran INF (no recomendable), maxCost puede ser -Inf; manejar ese caso:
    if (!isFinite(maxCost)) maxCost = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (!isFinite(transformed[i][j])) transformed[i][j] = INF;
      else transformed[i][j] = maxCost - transformed[i][j];
    }
  }

  // --- Hungarian algorithm (minimization) ---
  // Returns array `xy` where xy[row] = assigned column for that row (or -1)
  function hungarian(a) {
    const N = a.length;
    const u = Array(N + 1).fill(0);
    const v = Array(N + 1).fill(0);
    const p = Array(N + 1).fill(0);
    const way = Array(N + 1).fill(0);

    for (let i = 1; i <= N; i++) {
      p[0] = i;
      let j0 = 0;
      const minv = Array(N + 1).fill(INF);
      const used = Array(N + 1).fill(false);
      do {
        used[j0] = true;
        const i0 = p[j0];
        let delta = INF;
        let j1 = 0;
        for (let j = 1; j <= N; j++) {
          if (used[j]) continue;
          const cur = (isFinite(a[i0 - 1][j - 1]) ? a[i0 - 1][j - 1] : INF) - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
        for (let j = 0; j <= N; j++) {
          if (used[j]) {
            u[p[j]] += delta;
            v[j] -= delta;
          } else {
            minv[j] -= delta;
          }
        }
        j0 = j1;
      } while (p[j0] !== 0);

      do {
        const j1 = way[j0];
        p[j0] = p[j1];
        j0 = j1;
      } while (j0 !== 0);
    }

    const assignment = Array(N).fill(-1);
    for (let j = 1; j <= N; j++) {
      if (p[j] > 0 && p[j] <= N && j <= N) {
        assignment[p[j] - 1] = j - 1;
      }
    }
    // compute cost
    let totalCost = 0;
    for (let i = 0; i < N; i++) {
      const j = assignment[i];
      if (j >= 0 && isFinite(a[i][j])) totalCost += a[i][j];
      else totalCost += INF;
    }
    return { assignment, totalCost };
  }

  const { assignment, totalCost } = hungarian(transformed);

  const matches = [];
  let realTotalCost = 0;
  for (let i = 0; i < nRows; i++) {
    const col = assignment[i];
    if (col === -1 || col >= nCols) {
      matches.push({ agentId: agentIds[i], taskId: null, cost: null });
    } else {
      const originalCost = costMatrix[i][col];
      matches.push({ agentId: agentIds[i], taskId: taskIds[col], cost: originalCost });
      if (isFinite(originalCost)) realTotalCost += originalCost;
      else realTotalCost += INF;
    }
  }

  // Si mode === 'maximize', convertir totalCost de vuelta a la suma de beneficios
  if (mode === 'maximize') {
    let sumReal = 0;
    for (const m of matches) {
      if (m.taskId && isFinite(m.cost)) {
        sumReal+= m.cost;
      }
    }
   
  }

  return {
    matches, // array por cada agente: { agentId, taskId (or null if dummy), cost }
    cost: realTotalCost,
    agentIds,
    taskIds, 
    costMatrix
  };
}
