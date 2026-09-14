/**
 * Wave 45 — Par 55 passTurn seat flip leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn, selectBlock } from '../../src/games/par-55/rules';

describe('Wave 45 par — pass turn', () => {
  it('passTurn flips seat and clears selection', () => {
    const state = selectBlock(createInitialState(), createInitialState().hands.player1[0].id);
    // re-select on fresh
    const s = createInitialState();
    const placing = selectBlock(s, s.hands.player1[0].id);
    const next = passTurn(placing);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBlock).toBeNull();
    expect(next.phase).toBe('selectingBlock');
  });
});
