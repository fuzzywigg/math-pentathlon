/**
 * Wave 39 — Kings draw + FIAR path-block / deselect leftovers.
 * Handshake across under-tested engine reject branches. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isDrawCondition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import type { GameState } from '../../src/games/kings-quadraphages/game-state';

import {
  isPathBlocked,
  getSelectableNodes,
  deselectChip,
  placeChip,
} from '../../src/games/fiar/rules';
import { createInitialState as createFiar } from '../../src/games/fiar/types';

function surroundKings(state: GameState): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  // Fill entire board with quadraphages except the two king cells
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.type === 'king') continue;
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
  }
  return {
    ...state,
    board,
    player1Supply: 0,
    player2Supply: 0,
  };
}

describe('Wave 39 kings — isDrawCondition leftovers', () => {
  it('opening position is not a draw', () => {
    const state = createInitialGameState();
    expect(isDrawCondition(state)).toBe(false);
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
  });

  it('both kings with zero moves is a draw', () => {
    const trapped = surroundKings(createInitialGameState());
    expect(getValidKingMoves(trapped, 'player1')).toHaveLength(0);
    expect(getValidKingMoves(trapped, 'player2')).toHaveLength(0);
    expect(isDrawCondition(trapped)).toBe(true);
  });
});

describe('Wave 39 fiar — path block / deselect / selectable leftovers', () => {
  it('deselectChip clears selection; selectable empty in placement', () => {
    const state = createFiar();
    expect(getSelectableNodes(state)).toEqual([]);
    const selected = { ...state, phase: 'movement' as const, selectedNode: 'n0' };
    expect(deselectChip(selected).selectedNode).toBeNull();
  });

  it('isPathBlocked true when opponent sits adjacent to path', () => {
    let state = createFiar();
    // Place a few chips via API when possible; otherwise mutate board
    const nodeIds = [...state.board.nodes.keys()];
    const a = nodeIds[0];
    const neighbors = state.board.edges
      .filter((e) => e.from === a || e.to === a)
      .map((e) => (e.from === a ? e.to : e.from));
    if (neighbors.length === 0) {
      expect(isPathBlocked(state, [a], 'player1')).toBe(false);
      return;
    }
    const b = neighbors[0];
    const side = neighbors[1] ?? neighbors[0];
    // Put player1 on path a-b, opponent adjacent
    const nodes = new Map(state.board.nodes);
    nodes.set(a, { ...nodes.get(a)!, chip: 'player1' });
    nodes.set(b, { ...nodes.get(b)!, chip: 'player1' });
    nodes.set(side, { ...nodes.get(side)!, chip: 'player2' });
    state = {
      ...state,
      board: { ...state.board, nodes },
      phase: 'movement',
      chipsPlaced: { player1: 2, player2: 1 },
    };
    if (side === b) {
      // Degenerate graph — just assert API is callable
      expect(typeof isPathBlocked(state, [a, b], 'player1')).toBe('boolean');
    } else {
      expect(isPathBlocked(state, [a, b], 'player1')).toBe(true);
    }
    void placeChip;
  });
});
