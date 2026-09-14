/**
 * Wave 43 TOKENMAXX — Star Track selectChain reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectChain } from '../../src/games/star-track/rules';
import { createInitialState } from '../../src/games/star-track/types';

describe('Wave 43 star-track — select reject', () => {
  it('rejects wrong phase and null drawnChains', () => {
    const state = createInitialState();
    expect(selectChain(state, 0)).toBe(state);
    const selecting = {
      ...state,
      phase: 'selectChain' as const,
      drawnChains: null,
    };
    expect(selectChain(selecting, 0)).toBe(selecting);
  });
});
