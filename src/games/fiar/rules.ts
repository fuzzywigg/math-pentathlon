// FIAR Game Rules — Division II PDF (auto-detect wins; no timer)

import type {
  FiarGameState,
  Player,
  FiarMove,
  ChipKind,
  PathResult,
} from './types';
import {
  CONFIG,
  getOpponent,
  getConnectedNodes,
  getNodesInDirection,
  getBoardDirections,
  chipsRemaining,
} from './types';

// =============================================================================
// Placement Phase
// =============================================================================

export function canPlaceChip(
  state: FiarGameState,
  nodeId: string,
  chipKind: ChipKind = state.selectedChipKind
): boolean {
  if (state.phase !== 'placement') return false;

  const node = state.board.nodes.get(nodeId);
  if (!node || node.chip !== null) return false;

  const inv = state.chipInventory[state.currentPlayer];
  if (chipKind === 'plain') return inv.plain > 0;
  return inv.marked > 0;
}

export function setSelectedChipKind(
  state: FiarGameState,
  kind: ChipKind
): FiarGameState {
  const inv = state.chipInventory[state.currentPlayer];
  if (kind === 'plain' && inv.plain <= 0) return state;
  if (kind === 'marked' && inv.marked <= 0) return state;
  if (state.selectedChipKind === kind) return state;
  return { ...state, selectedChipKind: kind };
}

/**
 * Ensure selectedChipKind is available for the current player (auto-fallback).
 */
export function normalizeSelectedChipKind(state: FiarGameState): FiarGameState {
  const inv = state.chipInventory[state.currentPlayer];
  if (state.selectedChipKind === 'plain' && inv.plain > 0) return state;
  if (state.selectedChipKind === 'marked' && inv.marked > 0) return state;
  if (inv.plain > 0) return { ...state, selectedChipKind: 'plain' };
  if (inv.marked > 0) return { ...state, selectedChipKind: 'marked' };
  return state;
}

export function placeChip(
  state: FiarGameState,
  nodeId: string,
  chipKind: ChipKind = state.selectedChipKind
): FiarGameState {
  state = normalizeSelectedChipKind(state);
  const kind =
    chipKind === 'plain' || chipKind === 'marked'
      ? chipKind
      : state.selectedChipKind;
  if (!canPlaceChip(state, nodeId, kind)) return state;

  const actingPlayer = state.currentPlayer;
  const newBoard = {
    ...state.board,
    nodes: new Map(state.board.nodes),
  };

  const node = newBoard.nodes.get(nodeId)!;
  newBoard.nodes.set(nodeId, {
    ...node,
    chip: actingPlayer,
    chipKind: kind,
  });

  const prevInv = state.chipInventory[actingPlayer];
  const newInv = {
    ...prevInv,
    [kind]: prevInv[kind] - 1,
  };

  const newChipInventory = {
    ...state.chipInventory,
    [actingPlayer]: newInv,
  };

  const newChipsPlaced = {
    ...state.chipsPlaced,
    [actingPlayer]: state.chipsPlaced[actingPlayer] + 1,
  };

  const move: FiarMove = {
    player: actingPlayer,
    type: 'place',
    nodeId,
    chipKind: kind,
    moveNumber: state.moveHistory.length + 1,
  };

  let newState: FiarGameState = {
    ...state,
    board: newBoard,
    chipsPlaced: newChipsPlaced,
    chipInventory: newChipInventory,
    selectedNode: null,
    moveHistory: [...state.moveHistory, move],
  };

  // Auto-detect win (including during placement) for either color → actor wins
  const win = findAnyWinningPath(newState);
  if (win) {
    return {
      ...newState,
      winner: actingPlayer,
      winningPath: win.nodes,
      winningPathColor: win.color,
      phase: 'gameOver',
      currentPlayer: actingPlayer,
    };
  }

  const allPlaced =
    chipsRemaining(newChipInventory.player1) === 0 &&
    chipsRemaining(newChipInventory.player2) === 0;

  const nextPlayer = getOpponent(actingPlayer);
  newState = {
    ...newState,
    currentPlayer: nextPlayer,
    phase: allPlaced ? 'movement' : 'placement',
    selectedChipKind: 'plain',
  };
  return normalizeSelectedChipKind(newState);
}

// =============================================================================
// Movement Phase
// =============================================================================

/**
 * Valid destinations: any distance along a straight unoccupied path.
 * Cannot jump, cannot land on occupied, cannot cross yellow center.
 */
export function getValidMoves(state: FiarGameState, nodeId: string): string[] {
  if (state.phase !== 'movement') return [];

  const node = state.board.nodes.get(nodeId);
  if (!node || node.chip !== state.currentPlayer) return [];

  const validMoves: string[] = [];
  const directions = getBoardDirections(state.board);

  for (const dir of directions) {
    const nodesInDir = getNodesInDirection(state.board, nodeId, dir.dx, dir.dy);

    for (const targetId of nodesInDir) {
      const targetNode = state.board.nodes.get(targetId);
      if (targetNode?.chip !== null) break;
      validMoves.push(targetId);
    }
  }

  return validMoves;
}

export function canMove(
  state: FiarGameState,
  fromId: string,
  toId: string
): boolean {
  return getValidMoves(state, fromId).includes(toId);
}

export function moveChip(
  state: FiarGameState,
  fromId: string,
  toId: string
): FiarGameState {
  if (!canMove(state, fromId, toId)) return state;

  const actingPlayer = state.currentPlayer;
  const newBoard = {
    ...state.board,
    nodes: new Map(state.board.nodes),
  };

  const fromNode = newBoard.nodes.get(fromId)!;
  const chipKind = fromNode.chipKind;
  newBoard.nodes.set(fromId, { ...fromNode, chip: null, chipKind: null });

  const toNode = newBoard.nodes.get(toId)!;
  newBoard.nodes.set(toId, {
    ...toNode,
    chip: actingPlayer,
    chipKind,
  });

  const move: FiarMove = {
    player: actingPlayer,
    type: 'move',
    nodeId: toId,
    fromNodeId: fromId,
    chipKind: chipKind ?? undefined,
    moveNumber: state.moveHistory.length + 1,
  };

  const newState: FiarGameState = {
    ...state,
    board: newBoard,
    selectedNode: null,
    moveHistory: [...state.moveHistory, move],
  };

  const win = findAnyWinningPath(newState);
  if (win) {
    return {
      ...newState,
      winner: actingPlayer,
      winningPath: win.nodes,
      winningPathColor: win.color,
      phase: 'gameOver',
      currentPlayer: actingPlayer,
    };
  }

  return {
    ...newState,
    currentPlayer: getOpponent(actingPlayer),
  };
}

// =============================================================================
// Win Detection (gapped lines, marked-only blocking, either color)
// =============================================================================

/**
 * Maximal straight lines on the board that do not traverse yellow-crossing edges.
 * Cached on the board — the graph is layout-static.
 */
export function getStraightLines(state: FiarGameState): string[][] {
  if (state.board.straightLinesCache) {
    return state.board.straightLinesCache;
  }

  const lines: string[][] = [];
  const seen = new Set<string>();
  // One direction per axis (not the first four of the 8-ray list, which are
  // only orthogonal — diagonals live at indices 4–7).
  const allDirs = getBoardDirections(state.board);
  const halfDirs = [allDirs[0]!, allDirs[2]!, allDirs[4]!, allDirs[6]!];

  for (const [startId] of state.board.nodes) {
    for (const dir of halfDirs) {
      const forward = getNodesInDirection(state.board, startId, dir.dx, dir.dy);
      const backward = getNodesInDirection(
        state.board,
        startId,
        -dir.dx,
        -dir.dy
      );
      const line = [...backward.reverse(), startId, ...forward];
      if (line.length < CONFIG.WIN_LENGTH) continue;

      const key = `${dir.dx},${dir.dy}|${line.join('>')}`;
      const revKey = `${-dir.dx},${-dir.dy}|${[...line].reverse().join('>')}`;
      if (seen.has(key) || seen.has(revKey)) continue;
      seen.add(key);
      lines.push(line);
    }
  }

  state.board.straightLinesCache = lines;
  return lines;
}

function subsetUnblocked(
  state: FiarGameState,
  chipNodes: string[],
  color: Player
): string[] | null {
  if (chipNodes.length < CONFIG.WIN_LENGTH) return null;

  for (let i = 0; i < chipNodes.length; i++) {
    for (let j = i + CONFIG.WIN_LENGTH - 1; j < chipNodes.length; j++) {
      const subset = chipNodes.slice(i, j + 1);
      if (!isPathBlocked(state, subset, color)) {
        return subset;
      }
    }
  }
  return null;
}

/**
 * Find same-color alignments of 4+ chips along a straight line.
 * Empty spaces between chips are allowed; opposite-color chips break the segment.
 * Paths that would require crossing yellow are already excluded by line construction.
 */
export function findPaths(state: FiarGameState, player: Player): PathResult[] {
  const paths: PathResult[] = [];
  const lines = getStraightLines(state);

  for (const line of lines) {
    let segmentChips: string[] = [];

    const flush = () => {
      if (segmentChips.length >= CONFIG.WIN_LENGTH) {
        const unblocked = subsetUnblocked(state, segmentChips, player);
        if (unblocked) {
          paths.push({ nodes: unblocked, isBlocked: false, color: player });
        } else {
          paths.push({
            nodes: segmentChips.slice(0, CONFIG.WIN_LENGTH),
            isBlocked: true,
            color: player,
          });
        }
      }
      segmentChips = [];
    };

    for (const nodeId of line) {
      const node = state.board.nodes.get(nodeId);
      if (!node) continue;
      if (node.chip === player) {
        segmentChips.push(nodeId);
      } else if (node.chip === null) {
        // Gap allowed — keep segment open
      } else {
        // Opposite color intervenes
        flush();
      }
    }
    flush();
  }

  return paths;
}

/**
 * A path is blocked only by an opponent's MARKED chip adjacent (by an edge)
 * to one of the winning-path chip spaces.
 */
export function isPathBlocked(
  state: FiarGameState,
  path: string[],
  player: Player
): boolean {
  const opponent = getOpponent(player);

  for (const nodeId of path) {
    const connected = getConnectedNodes(state.board, nodeId);
    for (const connectedId of connected) {
      if (path.includes(connectedId)) continue;
      const connectedNode = state.board.nodes.get(connectedId);
      if (
        connectedNode?.chip === opponent &&
        connectedNode.chipKind === 'marked'
      ) {
        return true;
      }
    }
  }

  return false;
}

/** First unblocked winning path in either color, or null. */
export function findAnyWinningPath(state: FiarGameState): PathResult | null {
  for (const player of ['player1', 'player2'] as Player[]) {
    const paths = findPaths(state, player);
    const win = paths.find(
      (p) => !p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH
    );
    if (win) return win;
  }
  return null;
}

/**
 * Legacy helper: returns the COLOR that has an unblocked path, or null.
 * Prefer findAnyWinningPath + acting-player credit for game flow.
 */
export function checkWinner(state: FiarGameState): Player | null {
  return findAnyWinningPath(state)?.color ?? null;
}

export function getSelectableNodes(state: FiarGameState): string[] {
  if (state.phase !== 'movement') return [];

  const selectable: string[] = [];
  for (const [nodeId, node] of state.board.nodes) {
    if (node.chip === state.currentPlayer) {
      if (getValidMoves(state, nodeId).length > 0) {
        selectable.push(nodeId);
      }
    }
  }
  return selectable;
}

export function isDraw(state: FiarGameState): boolean {
  if (state.phase !== 'movement') return false;
  return getSelectableNodes(state).length === 0;
}

export function selectChip(
  state: FiarGameState,
  nodeId: string
): FiarGameState {
  const selectable = getSelectableNodes(state);
  if (!selectable.includes(nodeId)) return state;

  return {
    ...state,
    selectedNode: state.selectedNode === nodeId ? null : nodeId,
  };
}

export function deselectChip(state: FiarGameState): FiarGameState {
  return {
    ...state,
    selectedNode: null,
  };
}

/** Forge helper for tests: place a chip ignoring turn inventory. */
export function forceChip(
  state: FiarGameState,
  nodeId: string,
  player: Player,
  chipKind: ChipKind = 'plain'
): FiarGameState {
  const nodes = new Map(state.board.nodes);
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`missing ${nodeId}`);
  nodes.set(nodeId, { ...node, chip: player, chipKind });
  return {
    ...state,
    board: { ...state.board, nodes },
  };
}
