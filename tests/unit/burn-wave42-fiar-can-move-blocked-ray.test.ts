/**
 * Wave 42 — FIAR getValidMoves blocked by intervening chip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getValidMoves, canMove, canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG, type FiarGameState } from '../../src/games/fiar/types';

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
    chipsPlaced: { player1: CONFIG.CHIPS_PER_PLAYER, player2: CONFIG.CHIPS_PER_PLAYER },
    currentPlayer: 'player1',
  };
}

describe('Wave 42 fiar — blocked rays', () => {
  it('chip blocks further travel on row', () => {
    const s = board({ '2-0': 'player1', '2-2': 'player2' });
    const moves = getValidMoves(s, '2-0');
    expect(moves).toContain('2-1');
    expect(moves).not.toContain('2-2');
    expect(moves).not.toContain('2-3');
    expect(canMove(s, '2-0', '2-1')).toBe(true);
    expect(canMove(s, '2-0', '2-3')).toBe(false);
  });

  it('wrong owner / placement phase empty valids', () => {
    const s = board({ '1-1': 'player2' });
    expect(getValidMoves(s, '1-1')).toEqual([]);
    const open = createInitialState();
    expect(getValidMoves(open, '0-0')).toEqual([]);
    expect(canPlaceChip(open, '0-0')).toBe(true);
  });
});
