/**
 * Wave 41 — Contig 60 placeChip illegal value / phase identity rejects.
 * Wrong phase, missing dice, unknown/occupied → identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 41 contig-60 — placeChip illegal identity', () => {
  it('rolling / placing / gameOver phases are identity', () => {
    for (const phase of ['rolling', 'placing', 'gameOver'] as const) {
      const state = {
        ...createInitialState(),
        phase,
        currentDice: [1, 2, 3] as [number, number, number],
        winner: phase === 'gameOver' ? ('player1' as const) : null,
      };
      expect(placeChip(state, 1, '1+2-2')).toBe(state);
    }
  });

  it('calculating without dice is identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: null,
    };
    expect(placeChip(state, 1, 'x')).toBe(state);
  });

  it('unknown value and occupied cell are identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    expect(placeChip(state, 99999, 'x')).toBe(state);

    state.cells.get(1)!.owner = 'player2';
    expect(placeChip(state, 1, '1')).toBe(state);
  });

  it('legal empty cell mutates and flips seat', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    const next = placeChip(state, 1, '(1 + 2) * 3');
    expect(next).not.toBe(state);
    expect(next.cells.get(1)!.owner).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].expression).toBe('(1 + 2) * 3');
  });
});
