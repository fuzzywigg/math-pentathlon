/**
 * Wave 43 — Calla TOTAL_CUBES conserved after moves. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TOTAL_CUBES,
} from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

function total(state: ReturnType<typeof createInitialState>) {
  return (
    state.player1Pits.reduce((a, b) => a + b, 0) +
    state.player2Pits.reduce((a, b) => a + b, 0) +
    state.player1Calla +
    state.player2Calla
  );
}

describe('Wave 43 calla — cube conservation', () => {
  it('opening totals TOTAL_CUBES; move preserves total', () => {
    const open = createInitialState();
    expect(total(open)).toBe(TOTAL_CUBES);
    const next = makeMove(open, 0);
    expect(total(next)).toBe(TOTAL_CUBES);
    expect(next.moveHistory).toHaveLength(1);
  });
});
