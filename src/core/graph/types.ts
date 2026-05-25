// Graph/Network Types - Data structures for network-based game boards
// Used by: Bee-Hive, Saddle Up!, Trifecta

/** Unique identifier for a node */
export type NodeId = string;

/** A node (vertex) in the graph */
export interface GraphNode {
  id: NodeId;
  label?: string;
  position: { x: number; y: number };
  data?: Record<string, unknown>;
}

/** An edge connecting two nodes */
export interface GraphEdge {
  from: NodeId;
  to: NodeId;
  weight?: number;
  directed?: boolean;
  label?: string;
  data?: Record<string, unknown>;
}

/** A complete graph structure */
export interface Graph {
  nodes: Map<NodeId, GraphNode>;
  edges: GraphEdge[];
  directed: boolean;
}

/** Node state for game boards */
export interface NodeState {
  owner?: number; // Player ID
  value?: number;
  marked?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
}

/** Game board built on a graph */
export interface GraphBoard {
  graph: Graph;
  nodeStates: Map<NodeId, NodeState>;
}

/** Path through the graph */
export interface GraphPath {
  nodes: NodeId[];
  totalWeight: number;
}

/** Result of pathfinding */
export interface PathResult {
  found: boolean;
  path: NodeId[];
  distance: number;
}

/** Graph layout types */
export type LayoutType = 'grid' | 'circular' | 'tree' | 'force' | 'custom';

/** Configuration for graph rendering */
export interface GraphRenderConfig {
  nodeRadius: number;
  edgeWidth: number;
  nodeColors: {
    default: string;
    player1: string;
    player2: string;
    highlighted: string;
    disabled: string;
  };
  edgeColor: string;
  showLabels: boolean;
  showWeights: boolean;
  padding: number;
}

/** Default render configuration */
export const DEFAULT_GRAPH_CONFIG: GraphRenderConfig = {
  nodeRadius: 20,
  edgeWidth: 3,
  nodeColors: {
    default: '#e0e0e0',
    player1: '#2196f3',
    player2: '#f44336',
    highlighted: '#4caf50',
    disabled: '#9e9e9e',
  },
  edgeColor: '#666',
  showLabels: true,
  showWeights: false,
  padding: 40,
};

// =============================================================================
// Pre-built Graph Templates
// =============================================================================

/**
 * Create a grid graph (rows × cols)
 */
export function createGridGraph(rows: number, cols: number, spacing: number = 60): Graph {
  const nodes = new Map<NodeId, GraphNode>();
  const edges: GraphEdge[] = [];

  // Create nodes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${r}-${c}`;
      nodes.set(id, {
        id,
        label: `${r},${c}`,
        position: { x: c * spacing, y: r * spacing },
      });
    }
  }

  // Create edges (4-way connectivity)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${r}-${c}`;

      // Right neighbor
      if (c < cols - 1) {
        edges.push({ from: id, to: `${r}-${c + 1}` });
      }

      // Down neighbor
      if (r < rows - 1) {
        edges.push({ from: id, to: `${r + 1}-${c}` });
      }
    }
  }

  return { nodes, edges, directed: false };
}

/**
 * Create a circular graph with n nodes
 */
export function createCircularGraph(n: number, radius: number = 150): Graph {
  const nodes = new Map<NodeId, GraphNode>();
  const edges: GraphEdge[] = [];

  // Create nodes in a circle
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const id = `n${i}`;
    nodes.set(id, {
      id,
      label: String(i + 1),
      position: {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      },
    });

    // Connect to next node (forms a ring)
    if (i > 0) {
      edges.push({ from: `n${i - 1}`, to: id });
    }
  }

  // Close the ring
  if (n > 2) {
    edges.push({ from: `n${n - 1}`, to: 'n0' });
  }

  return { nodes, edges, directed: false };
}

/**
 * Create a star graph (center connected to n outer nodes)
 */
export function createStarGraph(n: number, radius: number = 150): Graph {
  const nodes = new Map<NodeId, GraphNode>();
  const edges: GraphEdge[] = [];

  // Center node
  nodes.set('center', {
    id: 'center',
    label: 'C',
    position: { x: 0, y: 0 },
  });

  // Outer nodes
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const id = `n${i}`;
    nodes.set(id, {
      id,
      label: String(i + 1),
      position: {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      },
    });

    // Connect to center
    edges.push({ from: 'center', to: id });
  }

  return { nodes, edges, directed: false };
}

/**
 * Create a hexagonal lattice graph
 */
export function createHexLatticeGraph(rings: number, size: number = 40): Graph {
  const nodes = new Map<NodeId, GraphNode>();
  const edges: GraphEdge[] = [];

  // Hex directions for pointy-top hexagons
  const directions = [
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: -1, r: 1 },
    { q: -1, r: 0 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
  ];

  // Generate hex coordinates within radius
  for (let q = -rings; q <= rings; q++) {
    for (let r = -rings; r <= rings; r++) {
      const s = -q - r;
      if (Math.abs(s) <= rings) {
        const id = `${q},${r}`;

        // Convert axial to pixel coordinates
        const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
        const y = size * ((3 / 2) * r);

        nodes.set(id, {
          id,
          position: { x, y },
        });
      }
    }
  }

  // Create edges between adjacent hexes
  nodes.forEach((_, id) => {
    const [q, r] = id.split(',').map(Number);

    for (const dir of directions) {
      const neighborId = `${q + dir.q},${r + dir.r}`;
      if (nodes.has(neighborId) && id < neighborId) {
        edges.push({ from: id, to: neighborId });
      }
    }
  });

  return { nodes, edges, directed: false };
}

/**
 * Create a track/path graph (linear with optional branches)
 */
export function createTrackGraph(length: number, spacing: number = 50): Graph {
  const nodes = new Map<NodeId, GraphNode>();
  const edges: GraphEdge[] = [];

  for (let i = 0; i < length; i++) {
    const id = `t${i}`;
    nodes.set(id, {
      id,
      label: String(i),
      position: { x: i * spacing, y: 0 },
    });

    if (i > 0) {
      edges.push({ from: `t${i - 1}`, to: id });
    }
  }

  return { nodes, edges, directed: false };
}

/**
 * Create a complete graph (every node connected to every other)
 */
export function createCompleteGraph(n: number, radius: number = 150): Graph {
  const base = createCircularGraph(n, radius);

  // Add all missing edges
  const nodeIds = Array.from(base.nodes.keys());
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 2; j < nodeIds.length; j++) {
      // Skip adjacent (already connected by circular)
      if (!(i === 0 && j === nodeIds.length - 1)) {
        base.edges.push({ from: nodeIds[i], to: nodeIds[j] });
      }
    }
  }

  return base;
}
