/**
 * Wave 40 — Contig-60 calculatePoints miss / wrong-phase noops.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/contig-60/types';
import {
  calculatePoints,
  doRollDice,
  placeChip,
  passTurn,
} from '../../src/games/contig-60/rules';

describe('Wave 40 contig-60 — points miss / phase identity', () => {
  it('calculatePoints missing cell value 999 → 0', () => {
    const state = createInitialState();
    expect(state.cells.has(999)).toBe(false);
    expect(calculatePoints(state, 999)).toBe(0);
  });

  it('doRollDice / placeChip / passTurn wrong phase → identity', () => {
    const calculating = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    expect(doRollDice(calculating)).toBe(calculating);

    const rolling = createInitialState();
    expect(rolling.phase).toBe('rolling');
    expect(placeChip(rolling, 1, '1')).toBe(rolling);
    expect(passTurn(rolling)).toBe(rolling);

    const gameOver = { ...rolling, phase: 'gameOver' as const };
    expect(doRollDice(gameOver)).toBe(gameOver);
    expect(placeChip(gameOver, 1, '1')).toBe(gameOver);
    expect(passTurn(gameOver)).toBe(gameOver);
  });
});
