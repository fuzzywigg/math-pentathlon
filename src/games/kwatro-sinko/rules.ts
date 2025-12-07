// Kwatro-Sinko Game Rules
// Movement along pathways, creating alignments of 4 or 5

import {
  KwaState,
  BoardNode,
  Chip,
  Alignment,
  KwaMove,
  Player,
  PLAYER_CHIPS,
  getOpponent,
  createChip,
  isWinningValue,
} from './types';

// =============================================================================
// Board Creation
// =============================================================================

/**
 * Create the game board - a grid with diagonal connections
 * The board is a 5x5 grid with pathways
 */
function createBoard(): Map<string, BoardNode> {
  const nodes = new Map<string, BoardNode>();

  // Create a 5x5 grid
  const SIZE = 5;
  const SPACING = 80;
  const OFFSET = 60;

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const id = `n${row}-${col}`;
      const isNumbered = (row === 0 || row === SIZE - 1); // Top and bottom rows are start positions

      nodes.set(id, {
        id,
        x: col * SPACING + OFFSET,
        y: row * SPACING + OFFSET,
        isNumbered,
        chip: null,
        connections: [],
      });
    }
  }

  // Create connections (horizontal, vertical, and diagonal)
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const id = `n${row}-${col}`;
      const node = nodes.get(id);
      if (!node) continue;

      const connections: string[] = [];

      // Horizontal connections
      if (col > 0) connections.push(`n${row}-${col - 1}`);
      if (col < SIZE - 1) connections.push(`n${row}-${col + 1}`);

      // Vertical connections
      if (row > 0) connections.push(`n${row - 1}-${col}`);
      if (row < SIZE - 1) connections.push(`n${row + 1}-${col}`);

      // Diagonal connections (for the center 3x3 area)
      if (row > 0 && row < SIZE - 1 && col > 0 && col < SIZE - 1) {
        // All 4 diagonals
        connections.push(`n${row - 1}-${col - 1}`);
        connections.push(`n${row - 1}-${col + 1}`);
        connections.push(`n${row + 1}-${col - 1}`);
        connections.push(`n${row + 1}-${col + 1}`);
      }

      node.connections = connections;
    }
  }

  return nodes;
}

/**
 * Create initial game state
 */
export function createInitialState(): KwaState {
  const nodes = createBoard();
  const chips = new Map<string, Chip>();

  // Create and place player 1 chips (even numbers, top row)
  PLAYER_CHIPS.player1.forEach((value, index) => {
    const chipId = `p1-${index}`;
    const nodeId = `n0-${index}`;
    const chip = createChip(chipId, value, 'player1');
    chip.position = nodeId;
    chips.set(chipId, chip);

    const node = nodes.get(nodeId);
    if (node) node.chip = chip;
  });

  // Create and place player 2 chips (odd numbers, bottom row)
  PLAYER_CHIPS.player2.forEach((value, index) => {
    const chipId = `p2-${index}`;
    const nodeId = `n4-${index}`;
    const chip = createChip(chipId, value, 'player2');
    chip.position = nodeId;
    chips.set(chipId, chip);

    const node = nodes.get(nodeId);
    if (node) node.chip = chip;
  });

  return {
    nodes,
    chips,
    currentPlayer: 'player1',
    selectedChip: null,
    phase: 'selectingChip',
    winner: null,
    winningAlignment: null,
    moveHistory: [],
  };
}

// =============================================================================
// Chip Selection
// =============================================================================

/**
 * Select a chip to move
 */
export function selectChip(state: KwaState, chipId: string): KwaState {
  if (state.phase !== 'selectingChip') return state;

  const chip = state.chips.get(chipId);
  if (!chip || chip.owner !== state.currentPlayer) return state;
  if (!chip.position) return state;

  // Check if chip has valid moves
  const validMoves = getValidMoves(state, chipId);
  if (validMoves.length === 0) return state;

  return {
    ...state,
    selectedChip: chipId,
    phase: 'selectingDest',
  };
}

/**
 * Clear chip selection
 */
export function clearSelection(state: KwaState): KwaState {
  return {
    ...state,
    selectedChip: null,
    phase: 'selectingChip',
  };
}

// =============================================================================
// Movement Validation
// =============================================================================

/**
 * Get valid moves for a chip
 */
export function getValidMoves(state: KwaState, chipId: string): string[] {
  const chip = state.chips.get(chipId);
  if (!chip || !chip.position) return [];

  const currentNode = state.nodes.get(chip.position);
  if (!currentNode) return [];

  const validMoves: string[] = [];

  // Can move to any connected empty node
  for (const connId of currentNode.connections) {
    const connNode = state.nodes.get(connId);
    if (connNode && !connNode.chip) {
      validMoves.push(connId);
    }
  }

  return validMoves;
}

/**
 * Check if a move is valid
 */
export function isValidMove(state: KwaState, chipId: string, toNodeId: string): boolean {
  const validMoves = getValidMoves(state, chipId);
  return validMoves.includes(toNodeId);
}

// =============================================================================
// Move Execution
// =============================================================================

/**
 * Move a chip to a new position
 */
export function moveChip(state: KwaState, toNodeId: string): KwaState {
  if (state.phase !== 'selectingDest' || !state.selectedChip) return state;
  if (!isValidMove(state, state.selectedChip, toNodeId)) return state;

  const chip = state.chips.get(state.selectedChip);
  if (!chip || !chip.position) return state;

  const fromNodeId = chip.position;

  // Update nodes
  const newNodes = new Map(state.nodes);

  // Clear old position
  const oldNode = newNodes.get(fromNodeId);
  if (oldNode) {
    newNodes.set(fromNodeId, { ...oldNode, chip: null });
  }

  // Set new position
  const newNode = newNodes.get(toNodeId);
  if (!newNode) return state;

  const updatedChip: Chip = { ...chip, position: toNodeId };
  newNodes.set(toNodeId, { ...newNode, chip: updatedChip });

  // Update chips
  const newChips = new Map(state.chips);
  newChips.set(chip.id, updatedChip);

  // Check for winning alignment
  const alignment = findWinningAlignment(newNodes, toNodeId);

  // Record move
  const move: KwaMove = {
    player: state.currentPlayer,
    chip: updatedChip,
    fromNode: fromNodeId,
    toNode: toNodeId,
    alignment,
    moveNumber: state.moveHistory.length + 1,
  };

  // Check for winner
  let winner: Player | null = null;
  let phase: KwaState['phase'] = 'selectingChip';

  if (alignment) {
    winner = state.currentPlayer;
    phase = 'gameOver';
  }

  // Also check if all chips are on non-numbered spaces (alternative win)
  if (!winner) {
    const playerChips = Array.from(newChips.values()).filter(
      (c) => c.owner === state.currentPlayer
    );
    const allOnNonNumbered = playerChips.every((c) => {
      if (!c.position) return false;
      const node = newNodes.get(c.position);
      return node && !node.isNumbered;
    });

    if (allOnNonNumbered) {
      winner = state.currentPlayer;
      phase = 'gameOver';
    }
  }

  return {
    ...state,
    nodes: newNodes,
    chips: newChips,
    currentPlayer: phase === 'gameOver' ? state.currentPlayer : getOpponent(state.currentPlayer),
    selectedChip: null,
    phase,
    winner,
    winningAlignment: alignment,
    moveHistory: [...state.moveHistory, move],
  };
}

// =============================================================================
// Alignment Detection
// =============================================================================

/**
 * Find a winning alignment through a node
 */
function findWinningAlignment(
  nodes: Map<string, BoardNode>,
  nodeId: string
): Alignment | null {
  const node = nodes.get(nodeId);
  if (!node || !node.chip) return null;

  // Check all lines through this node
  const directions = [
    [[0, -1], [0, 1]],   // Horizontal
    [[-1, 0], [1, 0]],   // Vertical
    [[-1, -1], [1, 1]],  // Diagonal \
    [[-1, 1], [1, -1]],  // Diagonal /
  ];

  // Parse node position
  const match = nodeId.match(/n(\d+)-(\d+)/);
  if (!match) return null;
  const row = parseInt(match[1]);
  const col = parseInt(match[2]);

  for (const [dir1, dir2] of directions) {
    // Collect chips in this line
    const lineChips: { node: BoardNode; chip: Chip }[] = [];

    // Add current node
    lineChips.push({ node, chip: node.chip });

    // Go in both directions
    for (const [dr, dc] of [dir1, dir2]) {
      let r = row + dr;
      let c = col + dc;

      while (r >= 0 && r < 5 && c >= 0 && c < 5) {
        const adjId = `n${r}-${c}`;
        const adjNode = nodes.get(adjId);

        if (adjNode?.chip) {
          lineChips.push({ node: adjNode, chip: adjNode.chip });
        } else {
          break; // Stop at empty node
        }

        r += dr;
        c += dc;
      }
    }

    // Check if we have at least 3 chips in a line
    if (lineChips.length >= 3) {
      const alignment = checkLineForWin(lineChips);
      if (alignment) return alignment;
    }
  }

  return null;
}

/**
 * Check a line of chips for a winning combination
 */
function checkLineForWin(
  lineChips: { node: BoardNode; chip: Chip }[]
): Alignment | null {
  // Try all combinations of 3 chips
  for (let i = 0; i < lineChips.length - 2; i++) {
    for (let j = i + 1; j < lineChips.length - 1; j++) {
      for (let k = j + 1; k < lineChips.length; k++) {
        const chips = [lineChips[i], lineChips[j], lineChips[k]];
        const values = chips.map((c) => c.chip.value);

        // Try different combinations: a + b - c, a - b + c, etc.
        const combinations = [
          { expr: `${values[0]} + ${values[1]} - ${values[2]}`, result: values[0] + values[1] - values[2] },
          { expr: `${values[0]} - ${values[1]} + ${values[2]}`, result: values[0] - values[1] + values[2] },
          { expr: `${values[1]} + ${values[2]} - ${values[0]}`, result: values[1] + values[2] - values[0] },
          { expr: `${values[0]} + ${values[2]} - ${values[1]}`, result: values[0] + values[2] - values[1] },
        ];

        for (const combo of combinations) {
          if (isWinningValue(combo.result)) {
            return {
              nodes: chips.map((c) => c.node.id),
              chips: chips.map((c) => c.chip),
              expression: `${combo.expr} = ${combo.result}`,
              result: combo.result,
            };
          }
        }
      }
    }
  }

  return null;
}

// =============================================================================
// Game Queries
// =============================================================================

/**
 * Check if player has any valid moves
 */
export function hasValidMoves(state: KwaState): boolean {
  for (const chip of state.chips.values()) {
    if (chip.owner === state.currentPlayer) {
      const moves = getValidMoves(state, chip.id);
      if (moves.length > 0) return true;
    }
  }
  return false;
}

/**
 * Pass turn (if no valid moves)
 */
export function passTurn(state: KwaState): KwaState {
  return {
    ...state,
    currentPlayer: getOpponent(state.currentPlayer),
    selectedChip: null,
    phase: 'selectingChip',
  };
}

/**
 * Format move for display
 */
export function formatMove(move: KwaMove): string {
  const result = move.alignment ? ` (${move.alignment.expression})` : '';
  return `Chip ${move.chip.value}${result}`;
}
