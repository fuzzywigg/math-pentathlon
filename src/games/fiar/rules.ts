// FIAR Game Rules
// Logic for placement, movement, win detection, and valid moves

import {
  FiarGameState,
  Player,
  FiarMove,
  CONFIG,
  PathResult,
  getOpponent,
  getConnectedNodes,
  getNodesInDirection,
  getDirections,
} from './types';

// =============================================================================
// Placement Phase
// =============================================================================

/**
 * Check if a node is valid for chip placement
 */
export function canPlaceChip(state: FiarGameState, nodeId: string): boolean {
  if (state.phase !== 'placement') return false;

  const node = state.board.nodes.get(nodeId);
  if (!node) return false;

  // Can't place on occupied node
  if (node.chip !== null) return false;

  // Check if current player has chips left to place
  const placed = state.chipsPlaced[state.currentPlayer];
  return placed < CONFIG.CHIPS_PER_PLAYER;
}

/**
 * Place a chip on a node
 */
export function placeChip(state: FiarGameState, nodeId: string): FiarGameState {
  if (!canPlaceChip(state, nodeId)) return state;

  const newBoard = {
    nodes: new Map(state.board.nodes),
    edges: state.board.edges,
  };

  const node = newBoard.nodes.get(nodeId)!;
  newBoard.nodes.set(nodeId, { ...node, chip: state.currentPlayer });

  const newChipsPlaced = {
    ...state.chipsPlaced,
    [state.currentPlayer]: state.chipsPlaced[state.currentPlayer] + 1,
  };

  const move: FiarMove = {
    player: state.currentPlayer,
    type: 'place',
    nodeId,
    moveNumber: state.moveHistory.length + 1,
  };

  // Check if all chips placed - transition to movement phase
  const totalPlaced = newChipsPlaced.player1 + newChipsPlaced.player2;
  const allPlaced = totalPlaced === CONFIG.CHIPS_PER_PLAYER * 2;

  return {
    ...state,
    board: newBoard,
    chipsPlaced: newChipsPlaced,
    currentPlayer: getOpponent(state.currentPlayer),
    phase: allPlaced ? 'movement' : 'placement',
    moveHistory: [...state.moveHistory, move],
  };
}

// =============================================================================
// Movement Phase
// =============================================================================

/**
 * Get valid moves for a chip at a given node
 * Chips can move any distance along a straight path (horizontal, vertical, diagonal)
 * Cannot jump over other chips
 */
export function getValidMoves(state: FiarGameState, nodeId: string): string[] {
  if (state.phase !== 'movement') return [];

  const node = state.board.nodes.get(nodeId);
  if (!node || node.chip !== state.currentPlayer) return [];

  const validMoves: string[] = [];
  const directions = getDirections();

  for (const dir of directions) {
    const nodesInDir = getNodesInDirection(state.board, nodeId, dir.dx, dir.dy);

    // Can move along path until blocked by another chip
    for (const targetId of nodesInDir) {
      const targetNode = state.board.nodes.get(targetId);
      if (targetNode?.chip !== null) break; // Blocked by chip
      validMoves.push(targetId);
    }
  }

  return validMoves;
}

/**
 * Check if a move is valid
 */
export function canMove(state: FiarGameState, fromId: string, toId: string): boolean {
  const validMoves = getValidMoves(state, fromId);
  return validMoves.includes(toId);
}

/**
 * Move a chip from one node to another
 */
export function moveChip(state: FiarGameState, fromId: string, toId: string): FiarGameState {
  if (!canMove(state, fromId, toId)) return state;

  const newBoard = {
    nodes: new Map(state.board.nodes),
    edges: state.board.edges,
  };

  // Remove chip from origin
  const fromNode = newBoard.nodes.get(fromId)!;
  newBoard.nodes.set(fromId, { ...fromNode, chip: null });

  // Place chip at destination
  const toNode = newBoard.nodes.get(toId)!;
  newBoard.nodes.set(toId, { ...toNode, chip: state.currentPlayer });

  const move: FiarMove = {
    player: state.currentPlayer,
    type: 'move',
    nodeId: toId,
    fromNodeId: fromId,
    moveNumber: state.moveHistory.length + 1,
  };

  let newState: FiarGameState = {
    ...state,
    board: newBoard,
    selectedNode: null,
    currentPlayer: getOpponent(state.currentPlayer),
    moveHistory: [...state.moveHistory, move],
  };

  // Check for winner
  const winner = checkWinner(newState);
  if (winner) {
    newState = {
      ...newState,
      winner,
      phase: 'gameOver',
    };
  }

  return newState;
}

// =============================================================================
// Win Detection
// =============================================================================

/**
 * Find paths of connected chips of the same color
 */
export function findPaths(state: FiarGameState, player: Player): PathResult[] {
  const paths: PathResult[] = [];
  const checked = new Set<string>();

  // Check all directions from each of the player's chips
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip !== player) continue;

    // Check each direction
    const directions = getDirections();
    // Only check half the directions to avoid duplicates (the other half is reverse)
    const halfDirs = directions.slice(0, 4);

    for (const dir of halfDirs) {
      const pathKey = `${nodeId}-${dir.dx}-${dir.dy}`;
      if (checked.has(pathKey)) continue;
      checked.add(pathKey);

      const path = [nodeId];

      // Extend in positive direction
      let currentId = nodeId;
      while (true) {
        const nodesInDir = getNodesInDirection(state.board, currentId, dir.dx, dir.dy);
        if (nodesInDir.length === 0) break;

        const nextId = nodesInDir[0];
        const nextNode = state.board.nodes.get(nextId);
        if (nextNode?.chip !== player) break;

        path.push(nextId);
        currentId = nextId;
      }

      // Extend in negative direction
      currentId = nodeId;
      while (true) {
        const nodesInDir = getNodesInDirection(state.board, currentId, -dir.dx, -dir.dy);
        if (nodesInDir.length === 0) break;

        const nextId = nodesInDir[0];
        const nextNode = state.board.nodes.get(nextId);
        if (nextNode?.chip !== player) break;

        path.unshift(nextId);
        currentId = nextId;
      }

      if (path.length >= CONFIG.WIN_LENGTH) {
        // Check if blocked by adjacent opponent chip
        const isBlocked = isPathBlocked(state, path, player);
        paths.push({ nodes: path, isBlocked });
      }
    }
  }

  return paths;
}

/**
 * Check if a winning path is blocked by an adjacent opponent chip
 */
export function isPathBlocked(state: FiarGameState, path: string[], player: Player): boolean {
  const opponent = getOpponent(player);

  // Check if any node in the path has an adjacent opponent chip
  for (const nodeId of path) {
    const connected = getConnectedNodes(state.board, nodeId);
    for (const connectedId of connected) {
      if (path.includes(connectedId)) continue; // Skip path nodes
      const connectedNode = state.board.nodes.get(connectedId);
      if (connectedNode?.chip === opponent) {
        return true; // Blocked!
      }
    }
  }

  return false;
}

/**
 * Check for a winner
 */
export function checkWinner(state: FiarGameState): Player | null {
  // Check both players
  for (const player of ['player1', 'player2'] as Player[]) {
    const paths = findPaths(state, player);

    // Find unblocked winning paths
    const winningPath = paths.find((p) => !p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH);
    if (winningPath) {
      return player;
    }
  }

  return null;
}

/**
 * Get all valid nodes for the current player to select/move
 */
export function getSelectableNodes(state: FiarGameState): string[] {
  if (state.phase !== 'movement') return [];

  const selectable: string[] = [];

  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip === state.currentPlayer) {
      // Check if this chip has any valid moves
      const moves = getValidMoves(state, nodeId);
      if (moves.length > 0) {
        selectable.push(nodeId);
      }
    }
  }

  return selectable;
}

/**
 * Check if the game is in a draw state (no valid moves for current player)
 */
export function isDraw(state: FiarGameState): boolean {
  if (state.phase !== 'movement') return false;

  const selectable = getSelectableNodes(state);
  return selectable.length === 0;
}

/**
 * Select a chip for movement
 */
export function selectChip(state: FiarGameState, nodeId: string): FiarGameState {
  const selectable = getSelectableNodes(state);
  if (!selectable.includes(nodeId)) return state;

  return {
    ...state,
    selectedNode: state.selectedNode === nodeId ? null : nodeId,
  };
}

/**
 * Deselect the current chip
 */
export function deselectChip(state: FiarGameState): FiarGameState {
  return {
    ...state,
    selectedNode: null,
  };
}
