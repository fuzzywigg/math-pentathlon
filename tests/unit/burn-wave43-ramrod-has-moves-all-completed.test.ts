/**
 * Wave 43 — Ramrod hasValidMoves false when all boxes completed. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — hasValidMoves all completed', () => {
  it('false when every box marked completedBy', () => {
    const state = createInitialState();
    const boxes = new Map(state.boxes);
    for (const [id, box] of boxes) {
      boxes.set(id, { ...box, completedBy: 'player2' });
    }
    expect(hasValidMoves({ ...state, boxes })).toBe(false);
  });
});
