/**
 * Wave 42 — Kwatro-Sinko getValidMoves for each player1 chip at opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';

describe('Wave 42 kwatro-sinko — opening p1 valid moves', () => {
  it('p1-0 from corner advances one step into row 1', () => {
    const state = createInitialState();
    expect(getValidMoves(state, 'p1-0')).toEqual(['n1-0']);
  });

  it('p1-2 from center-top drops to n1-2 only', () => {
    const state = createInitialState();
    expect(getValidMoves(state, 'p1-2')).toEqual(['n1-2']);
  });

  it('p1-4 from top-right mirrors corner pattern', () => {
    const state = createInitialState();
    expect(getValidMoves(state, 'p1-4')).toEqual(['n1-4']);
  });

  it('every player1 chip has exactly one opening move downward', () => {
    const state = createInitialState();
    for (let index = 0; index < 5; index++) {
      const chipId = `p1-${index}`;
      const moves = getValidMoves(state, chipId);
      expect(moves).toHaveLength(1);
      expect(moves[0]).toBe(`n1-${index}`);
    }
  });
});
