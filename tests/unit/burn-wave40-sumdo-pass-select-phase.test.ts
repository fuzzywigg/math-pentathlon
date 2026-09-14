/**
 * Wave 40 — Sum Dominoes pass/select/place phase rejects.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectDomino,
  placeDomino,
  passTurn,
  doRollDice,
} from '../../src/games/sum-dominoes/rules';

describe('Wave 40 sum-dominoes — phase rejects', () => {
  it('passTurn wrong phase → identity', () => {
    const state = createInitialState();
    // Initial is typically rolling
    expect(passTurn(state)).toBe(state);
  });

  it('selectDomino ghost / no dice → identity', () => {
    const state = createInitialState();
    expect(selectDomino(state, 'ghost')).toBe(state);
    const rolled = doRollDice(state);
    if (rolled !== state) {
      expect(selectDomino(rolled, 'no-such-domino')).toBe(rolled);
    }
  });

  it('placeDomino wrong phase → identity', () => {
    const state = createInitialState();
    expect(
      placeDomino(state, { row: 0, col: 0 }, 'horizontal')
    ).toBe(state);
  });
});
