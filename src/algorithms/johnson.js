export const runJohnsonAlgorithm = (nodes, edges) => {
    const numNodes = nodes.length;
    const nodeIds = nodes.map(n => n.id);
    const nodeMap = new Map(nodeIds.map((id, i) => [id, i]));
    // PASO 1 y 2: Bellman-Ford para potenciales (h) y detección de ciclos
    const h = new Array(numNodes).fill(0);

    for (let i = 0; i < numNodes - 1; i++) {
        for (const edge of edges) {
            const u = nodeMap.get(edge.source);
            const v = nodeMap.get(edge.target);
            if (h[u] !== Infinity && h[u] + edge.weight < h[v]) {
                h[v] = h[u] + edge.weight;
            }
        }
    }

    for (const edge of edges) {
        const u = nodeMap.get(edge.source);
        const v = nodeMap.get(edge.target);
        if (h[u] !== Infinity && h[u] + edge.weight < h[v]) {
            return { error: "El grafo contiene un ciclo de peso negativo (o positivo si se maximiza)." };
        }
    }

    // PASO 3: Re-ponderar
    const reweightedEdges = edges.map(edge => {
        const u = nodeMap.get(edge.source);
        const v = nodeMap.get(edge.target);
        return {
            ...edge,
            weight: edge.weight + h[u] - h[v]
        };
    });

    // PASO 4: Dijkstra para cada nodo
    const finalDistances = Array(numNodes).fill(null).map(() => Array(numNodes).fill(Infinity));
    const predecessors = Array(numNodes).fill(null).map(() => Array(numNodes).fill(-1));

    for (let i = 0; i < numNodes; i++) {
        const dist = new Array(numNodes).fill(Infinity);
        const prev = new Array(numNodes).fill(-1);
        dist[i] = 0;
        
        let Q = nodes.map((_, index) => index);

        while (Q.length > 0) {
            let u = -1;
            let min_dist = Infinity;
            Q.forEach(index => {
                if (dist[index] < min_dist) {
                    min_dist = dist[index];
                    u = index;
                }
            });

            if (u === -1) break;
            Q = Q.filter(index => index !== u);

            const uNodeId = nodeIds[u];
            const neighbors = reweightedEdges.filter(e => e.source === uNodeId);

            for (const edge of neighbors) {
                const v = nodeMap.get(edge.target);
                if (dist[u] + edge.weight < dist[v]) {
                    dist[v] = dist[u] + edge.weight;
                    prev[v] = u;
                }
            }
        }

        for (let j = 0; j < numNodes; j++) {
            if (dist[j] !== Infinity) {
                finalDistances[i][j] = dist[j] - h[i] + h[j];
            }
        }
        predecessors[i] = prev;
    }

    return { distances: finalDistances, predecessors, error: null };
};