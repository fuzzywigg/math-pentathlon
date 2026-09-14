/**
 * Wave 48 — Ramrod passTurn clears selection and flips seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod, passTurn } from '../../src/games/ramrod/rules';

describe('Wave 48 ramrod — pass clears selection', () => {
  it('pass from placingRod clears selectedRod and flips', () => {
    const s = createInitialState();
    const selected = selectRod(s, s.playerRods.player1[0]);
    expect(selected.phase).toBe('placingRod');
    const next = passTurn(selected);
    expect(next.selectedRod).toBeNull();
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingRod');
  });
});
