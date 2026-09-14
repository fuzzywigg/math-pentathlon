/**
 * Wave 44 — Sum Dominoes placeDomino reject leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeDomino } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 Sum Dominoes — placeDomino reject gates', () => {
  it('identity without selection / wrong phase / invalid spot', () => {
    const s = createInitialState();
    expect(placeDomino(s, { row: 5, col: 5 }, 'horizontal')).toEqual(s);
    const placing = {
      ...s,
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedDomino: null,
    };
    expect(placeDomino(placing, { row: 0, col: 0 }, 'horizontal')).toEqual(placing);
    const withSel = {
      ...placing,
      selectedDomino: s.hands.player1[0].id,
    };
    expect(placeDomino(withSel, { row: -1, col: 0 }, 'horizontal')).toEqual(withSel);
  });
});
