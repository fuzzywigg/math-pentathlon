// FIAR (Four In A Row) Game Types
// A network-based alignment game where players place and move chips to form 4 in a row

export type Player = 'player1' | 'player2';

// Node on the game board
export interface BoardNode {
  id: string;
  x: number; // Visual position
  y: number;
  chip: Player | null; // Chip placed on this node
}

// Edge connecting two nodes (defines valid paths)
export interface BoardEdge {
  from: string;
  to: string;
}

// The game board is a graph of nodes connected by edges
export interface FiarBoard {
  nodes: Map<string, BoardNode>;
  edges: BoardEdge[];
}

// Game phases
export type GamePhase = 'placement' | 'movement' | 'gameOver';

// Game state
export interface FiarGameState {
  board: FiarBoard;
  currentPlayer: Player;
  phase: GamePhase;
  chipsPlaced: { player1: number; player2: number };
  selectedNode: string | null; // For movement phase
  winner: Player | null;
  moveHistory: FiarMove[];
}

// A move in the game
export interface FiarMove {
  player: Player;
  type: 'place' | 'move';
  nodeId: string; // For placement: where placed; For move: destination
  fromNodeId?: string; // For moves: origin
  moveNumber: number;
}

// Path result for 4-in-a-row detection
export interface PathResult {
  nodes: string[];
  isBlocked: boolean; // If adjacent blocking chip exists
}

// Configuration
export const CONFIG = {
  CHIPS_PER_PLAYER: 4,
  WIN_LENGTH: 4, // Need 4 in a row to win
  NODE_RADIUS: 24,
  EDGE_STROKE: 3,
};

// =============================================================================
// Board Creation - Network Graph Layout
// =============================================================================

/**
 * Create the FIAR board - a network of connected nodes
 * The board forms a grid-like pattern with diagonal connections
 * Typical layout: 5x5 grid with additional diagonal paths
 */
export function createFiarBoard(): FiarBoard {
  const nodes = new Map<string, BoardNode>();
  const edges: BoardEdge[] = [];

  // Create a 5x5 grid of nodes
  const gridSize = 5;
  const spacing = 80;
  const offsetX = 200;
  const offsetY = 100;

  // Create nodes
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const id = `${row}-${col}`;
      nodes.set(id, {
        id,
        x: offsetX + col * spacing,
        y: offsetY + row * spacing,
        chip: null,
      });
    }
  }

  // Create edges (horizontal, vertical, and diagonal connections)
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const id = `${row}-${col}`;

      // Horizontal connection (right)
      if (col < gridSize - 1) {
        edges.push({ from: id, to: `${row}-${col + 1}` });
      }

      // Vertical connection (down)
      if (row < gridSize - 1) {
        edges.push({ from: id, to: `${row + 1}-${col}` });
      }

      // Diagonal connections (down-right and down-left)
      if (row < gridSize - 1 && col < gridSize - 1) {
        edges.push({ from: id, to: `${row + 1}-${col + 1}` });
      }
      if (row < gridSize - 1 && col > 0) {
        edges.push({ from: id, to: `${row + 1}-${col - 1}` });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Create initial game state
 */
export function createInitialState(): FiarGameState {
  return {
    board: createFiarBoard(),
    currentPlayer: 'player1',
    phase: 'placement',
    chipsPlaced: { player1: 0, player2: 0 },
    selectedNode: null,
    winner: null,
    moveHistory: [],
  };
}

/**
 * Get opponent
 */
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

/**
 * Check if two nodes are connected by an edge
 */
export function areConnected(board: FiarBoard, nodeA: string, nodeB: string): boolean {
  return board.edges.some(
    (edge) =>
      (edge.from === nodeA && edge.to === nodeB) ||
      (edge.from === nodeB && edge.to === nodeA)
  );
}

/**
 * Get all nodes connected to a given node
 */
export function getConnectedNodes(board: FiarBoard, nodeId: string): string[] {
  const connected: string[] = [];

  for (const edge of board.edges) {
    if (edge.from === nodeId) {
      connected.push(edge.to);
    } else if (edge.to === nodeId) {
      connected.push(edge.from);
    }
  }

  return connected;
}

/**
 * Get nodes in a specific direction from a given node
 * Returns all nodes in a straight line (following edges) until blocked or edge of board
 */
export function getNodesInDirection(
  board: FiarBoard,
  startId: string,
  dx: number,
  dy: number
): string[] {
  const result: string[] = [];
  const startNode = board.nodes.get(startId);
  if (!startNode) return result;

  // Find nodes along the direction
  let currentX = startNode.x;
  let currentY = startNode.y;

  while (true) {
    currentX += dx;
    currentY += dy;

    // Find node at this position
    let found = false;
    for (const [id, node] of board.nodes) {
      if (Math.abs(node.x - currentX) < 10 && Math.abs(node.y - currentY) < 10) {
        // Check if connected to previous node
        const prevId = result.length > 0 ? result[result.length - 1] : startId;
        if (areConnected(board, prevId, id)) {
          result.push(id);
          found = true;
          break;
        }
      }
    }

    if (!found) break;
  }

  return result;
}

/**
 * Get all 8 directions for path checking
 */
export function getDirections(): { dx: number; dy: number }[] {
  const spacing = 80; // Must match board spacing
  return [
    { dx: spacing, dy: 0 },    // Right
    { dx: -spacing, dy: 0 },   // Left
    { dx: 0, dy: spacing },    // Down
    { dx: 0, dy: -spacing },   // Up
    { dx: spacing, dy: spacing },   // Down-right
    { dx: -spacing, dy: -spacing }, // Up-left
    { dx: spacing, dy: -spacing },  // Up-right
    { dx: -spacing, dy: spacing },  // Down-left
  ];
}
