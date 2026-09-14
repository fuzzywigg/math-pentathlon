/**
 * Wave 43 — Ramrod passTurn clears selection from placingRod. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectRod,
  passTurn,
} from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — pass from placing', () => {
  it('passTurn from placingRod flips seat and clears selection', () => {
    const open = createInitialState();
    const rodId = open.playerRods.player1[0];
    const placing = selectRod(open, rodId);
    expect(placing.phase).toBe('placingRod');
    const next = passTurn(placing);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedRod).toBeNull();
    expect(next.phase).toBe('selectingRod');
  });
});
