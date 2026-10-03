/**
 * Overnight HEAVY — FIAR getValidMoves includes clear diagonal rays.
 * Distinct leftover vs wave42 blocked-ray (cardinal). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getValidMoves } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function movementBoard(
  placements: Array<{ id: string; chip: 'player1' | 'player2' }>
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const p of placements) {
    nodes.set(p.id, { ...nodes.get(p.id)!, chip: p.chip });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer: 'player1',
  };
}

describe('Overnight fiar — diagonal valid moves', () => {
  it('chip can slide diagonally into empty cells; stops at opponent', () => {
    // Spec diagonal c1r2–c2r3–c3r4–c4r5–c5r6 (does not use diamond-border edges)
    const state = movementBoard([
      { id: 'c1r2', chip: 'player1' },
      { id: 'c5r6', chip: 'player2' }, // blocks far end
      { id: 'c6r1', chip: 'player2' },
      { id: 'c0r3', chip: 'player2' },
    ]);
    const moves = getValidMoves(state, 'c1r2');
    expect(moves).toContain('c2r3');
    expect(moves).toContain('c3r4');
    expect(moves).toContain('c4r5');
    expect(moves).not.toContain('c5r6');
  });
});
