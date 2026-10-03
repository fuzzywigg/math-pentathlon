/**
 * Wave 42 — FIAR getValidMoves blocked by intervening chip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getValidMoves,
  canMove,
  canPlaceChip,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function board(chips: Record<string, 'player1' | 'player2'>): FiarGameState {
  const s = createInitialState();
  const nodes = new Map(s.board.nodes);
  for (const [id, chip] of Object.entries(chips)) {
    nodes.set(id, { ...nodes.get(id)!, chip });
  }
  return {
    ...s,
    board: { ...s.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer: 'player1',
  };
}

describe('Wave 42 fiar — blocked rays', () => {
  it('chip blocks further travel on row', () => {
    const s = board({ c1r2: 'player1', c3r2: 'player2' });
    const moves = getValidMoves(s, 'c1r2');
    expect(moves).toContain('c2r2');
    expect(moves).not.toContain('c3r2');
    expect(moves).not.toContain('c4r2');
    expect(canMove(s, 'c1r2', 'c2r2')).toBe(true);
    expect(canMove(s, 'c1r2', 'c4r2')).toBe(false);
  });

  it('wrong owner / placement phase empty valids', () => {
    const s = board({ c3r2: 'player2' });
    expect(getValidMoves(s, 'c3r2')).toEqual([]);
    const open = createInitialState();
    expect(getValidMoves(open, 'c1r2')).toEqual([]);
    expect(canPlaceChip(open, 'c1r2')).toBe(true);
  });
});
