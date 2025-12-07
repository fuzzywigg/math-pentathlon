// Graph Algorithms - Pathfinding, connectivity, and traversal
// Core algorithms for network-based game mechanics

import { Graph, NodeId, GraphPath, PathResult, GraphBoard } from './types';

/**
 * Get all neighbors of a node
 */
export function getNeighbors(graph: Graph, nodeId: NodeId): NodeId[] {
  const neighbors: Set<NodeId> = new Set();

  for (const edge of graph.edges) {
    if (edge.from === nodeId) {
      neighbors.add(edge.to);
    }
    if (!graph.directed && edge.to === nodeId) {
      neighbors.add(edge.from);
    }
  }

  return Array.from(neighbors);
}

/**
 * Get edge between two nodes (if exists)
 */
export function getEdge(graph: Graph, from: NodeId, to: NodeId) {
  return graph.edges.find(
    (e) =>
      (e.from === from && e.to === to) ||
      (!graph.directed && e.from === to && e.to === from)
  );
}

/**
 * Check if two nodes are connected by an edge
 */
export function areAdjacent(graph: Graph, a: NodeId, b: NodeId): boolean {
  return getEdge(graph, a, b) !== undefined;
}

/**
 * Breadth-First Search - find shortest path (unweighted)
 */
export function bfs(graph: Graph, start: NodeId, end: NodeId): PathResult {
  if (start === end) {
    return { found: true, path: [start], distance: 0 };
  }

  const visited = new Set<NodeId>();
  const queue: { node: NodeId; path: NodeId[] }[] = [{ node: start, path: [start] }];

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = getNeighbors(graph, node);

    for (const neighbor of neighbors) {
      if (neighbor === end) {
        return {
          found: true,
          path: [...path, neighbor],
          distance: path.length,
        };
      }

      if (!visited.has(neighbor)) {
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return { found: false, path: [], distance: -1 };
}

/**
 * Dijkstra's Algorithm - find shortest path (weighted)
 */
export function dijkstra(graph: Graph, start: NodeId, end: NodeId): PathResult {
  const distances = new Map<NodeId, number>();
  const previous = new Map<NodeId, NodeId | null>();
  const unvisited = new Set<NodeId>();

  // Initialize
  graph.nodes.forEach((_, nodeId) => {
    distances.set(nodeId, nodeId === start ? 0 : Infinity);
    previous.set(nodeId, null);
    unvisited.add(nodeId);
  });

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current: NodeId | null = null;
    let minDist = Infinity;

    unvisited.forEach((nodeId) => {
      const dist = distances.get(nodeId)!;
      if (dist < minDist) {
        minDist = dist;
        current = nodeId;
      }
    });

    if (current === null || minDist === Infinity) break;
    if (current === end) break;

    unvisited.delete(current);

    // Update neighbors
    const neighbors = getNeighbors(graph, current);
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor)) continue;

      const edge = getEdge(graph, current, neighbor);
      const weight = edge?.weight ?? 1;
      const alt = distances.get(current)! + weight;

      if (alt < distances.get(neighbor)!) {
        distances.set(neighbor, alt);
        previous.set(neighbor, current);
      }
    }
  }

  // Reconstruct path
  if (distances.get(end) === Infinity) {
    return { found: false, path: [], distance: -1 };
  }

  const path: NodeId[] = [];
  let current: NodeId | null = end;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }

  return {
    found: true,
    path,
    distance: distances.get(end)!,
  };
}

/**
 * Check if graph is connected (all nodes reachable from any node)
 */
export function isConnected(graph: Graph): boolean {
  if (graph.nodes.size === 0) return true;

  const startResult = graph.nodes.keys().next();
  if (startResult.done) return true;
  const start: NodeId = startResult.value;
  const visited = new Set<NodeId>();
  const queue: NodeId[] = [start];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = getNeighbors(graph, node);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return visited.size === graph.nodes.size;
}

/**
 * Find all connected components
 */
export function findComponents(graph: Graph): NodeId[][] {
  const visited = new Set<NodeId>();
  const components: NodeId[][] = [];

  graph.nodes.forEach((_, nodeId) => {
    if (visited.has(nodeId)) return;

    const component: NodeId[] = [];
    const queue: NodeId[] = [nodeId];

    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visited.has(node)) continue;
      visited.add(node);
      component.push(node);

      const neighbors = getNeighbors(graph, node);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    components.push(component);
  });

  return components;
}

/**
 * Find all nodes reachable from a starting node
 */
export function findReachable(graph: Graph, start: NodeId): Set<NodeId> {
  const reachable = new Set<NodeId>();
  const queue: NodeId[] = [start];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (reachable.has(node)) continue;
    reachable.add(node);

    const neighbors = getNeighbors(graph, node);
    for (const neighbor of neighbors) {
      if (!reachable.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return reachable;
}

/**
 * Find all paths between two nodes (up to maxDepth)
 */
export function findAllPaths(
  graph: Graph,
  start: NodeId,
  end: NodeId,
  maxDepth: number = 10
): GraphPath[] {
  const paths: GraphPath[] = [];

  function dfs(current: NodeId, path: NodeId[], visited: Set<NodeId>, weight: number): void {
    if (path.length > maxDepth) return;

    if (current === end) {
      paths.push({ nodes: [...path], totalWeight: weight });
      return;
    }

    const neighbors = getNeighbors(graph, current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const edge = getEdge(graph, current, neighbor);
        const edgeWeight = edge?.weight ?? 1;
        dfs(neighbor, [...path, neighbor], visited, weight + edgeWeight);
        visited.delete(neighbor);
      }
    }
  }

  const visited = new Set<NodeId>([start]);
  dfs(start, [start], visited, 0);

  return paths;
}

/**
 * Find nodes at exact distance from start
 */
export function findNodesAtDistance(graph: Graph, start: NodeId, distance: number): NodeId[] {
  const distances = new Map<NodeId, number>();
  const queue: NodeId[] = [start];
  distances.set(start, 0);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const nodeDist = distances.get(node)!;

    if (nodeDist >= distance) continue;

    const neighbors = getNeighbors(graph, node);
    for (const neighbor of neighbors) {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, nodeDist + 1);
        queue.push(neighbor);
      }
    }
  }

  return Array.from(distances.entries())
    .filter(([_, d]) => d === distance)
    .map(([nodeId]) => nodeId);
}

/**
 * Find nodes within distance from start
 */
export function findNodesWithinDistance(graph: Graph, start: NodeId, maxDistance: number): NodeId[] {
  const distances = new Map<NodeId, number>();
  const queue: NodeId[] = [start];
  distances.set(start, 0);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const nodeDist = distances.get(node)!;

    if (nodeDist >= maxDistance) continue;

    const neighbors = getNeighbors(graph, node);
    for (const neighbor of neighbors) {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, nodeDist + 1);
        queue.push(neighbor);
      }
    }
  }

  return Array.from(distances.keys());
}

/**
 * Calculate degree of a node (number of connections)
 */
export function getNodeDegree(graph: Graph, nodeId: NodeId): number {
  return getNeighbors(graph, nodeId).length;
}

/**
 * Find nodes owned by a player that form a connected region
 */
export function findPlayerRegion(
  board: GraphBoard,
  startNode: NodeId,
  playerId: number
): NodeId[] {
  const region: NodeId[] = [];
  const visited = new Set<NodeId>();
  const queue: NodeId[] = [startNode];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;

    const state = board.nodeStates.get(node);
    if (state?.owner !== playerId) continue;

    visited.add(node);
    region.push(node);

    const neighbors = getNeighbors(board.graph, node);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return region;
}

/**
 * Find all regions owned by a player
 */
export function findAllPlayerRegions(board: GraphBoard, playerId: number): NodeId[][] {
  const visited = new Set<NodeId>();
  const regions: NodeId[][] = [];

  board.nodeStates.forEach((state, nodeId) => {
    if (state.owner === playerId && !visited.has(nodeId)) {
      const region = findPlayerRegion(board, nodeId, playerId);
      region.forEach((n) => visited.add(n));
      regions.push(region);
    }
  });

  return regions;
}

/**
 * Check if a player has connected two sets of nodes
 */
export function playerConnectsSets(
  board: GraphBoard,
  playerId: number,
  setA: NodeId[],
  setB: NodeId[]
): boolean {
  // Find all player-owned nodes
  const playerNodes = new Set<NodeId>();
  board.nodeStates.forEach((state, nodeId) => {
    if (state.owner === playerId) {
      playerNodes.add(nodeId);
    }
  });

  // Check if any node in setA connects to any node in setB through player nodes
  for (const startNode of setA) {
    if (!playerNodes.has(startNode)) continue;

    const reachable = new Set<NodeId>();
    const queue: NodeId[] = [startNode];

    while (queue.length > 0) {
      const node = queue.shift()!;
      if (reachable.has(node)) continue;
      reachable.add(node);

      // Check if we reached setB
      if (setB.includes(node)) {
        return true;
      }

      const neighbors = getNeighbors(board.graph, node);
      for (const neighbor of neighbors) {
        if (playerNodes.has(neighbor) && !reachable.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return false;
}

/**
 * Count the longest path owned by a player
 */
export function findLongestPlayerPath(board: GraphBoard, playerId: number): NodeId[] {
  let longestPath: NodeId[] = [];

  // Get all player nodes
  const playerNodes: NodeId[] = [];
  board.nodeStates.forEach((state, nodeId) => {
    if (state.owner === playerId) {
      playerNodes.push(nodeId);
    }
  });

  // Try starting from each player node
  for (const start of playerNodes) {
    const visited = new Set<NodeId>();

    function dfs(current: NodeId, path: NodeId[]): void {
      if (path.length > longestPath.length) {
        longestPath = [...path];
      }

      const neighbors = getNeighbors(board.graph, current);
      for (const neighbor of neighbors) {
        const state = board.nodeStates.get(neighbor);
        if (state?.owner === playerId && !visited.has(neighbor)) {
          visited.add(neighbor);
          dfs(neighbor, [...path, neighbor]);
          visited.delete(neighbor);
        }
      }
    }

    visited.add(start);
    dfs(start, [start]);
  }

  return longestPath;
}
