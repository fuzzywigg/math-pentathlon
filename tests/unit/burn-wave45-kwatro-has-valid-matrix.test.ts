/**
 * Wave 45 — Kwatro hasValidMoves matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — hasValidMoves', () => {
  it('true at opening for p1', () => {
    expect(hasValidMoves(createInitialState())).toBe(true);
  });
});
