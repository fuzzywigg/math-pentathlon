/**
 * Wave 58 Contig/SD residual — Sum selectDomino null-dice identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDomino } from '../../src/games/sum-dominoes/rules';

describe('Wave 58 sum — select no dice', () => {
  it('returns same reference when placing but currentDice null', () => {
    const base = createInitialState();
    const id = base.hands.player1[0]!.id;
    const state = {
      ...base,
      phase: 'placing' as const,
      currentDice: null,
      selectedDomino: null,
    };
    expect(selectDomino(state, id)).toBe(state);
  });
});
