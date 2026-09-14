/**
 * Wave 58 Contig/SD residual — Sum placeDomino without selection identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeDomino } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';

describe('Wave 58 sum — place without selection', () => {
  it('returns same reference when selectedDomino null', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [3, 4] as [number, number],
      selectedDomino: null,
    };
    expect(
      placeDomino(
        state,
        { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL + 2 },
        'horizontal'
      )
    ).toBe(state);
  });
});
