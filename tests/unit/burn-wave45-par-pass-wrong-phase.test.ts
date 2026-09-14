/**
 * Wave 45 TOKENMAXX — Par-55 passTurn phase gate leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn, selectBlock } from '../../src/games/par-55/rules';

describe('Wave 45 par55 — passTurn gates', () => {
  it('pass flips seat from selectingBlock; identity-ish after place phase', () => {
    const open = createInitialState();
    const passed = passTurn(open);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.selectedBlock).toBeNull();
    const placing = selectBlock(open, open.hands.player1[0].id);
    expect(placing.phase).toBe('placingBlock');
    // passTurn does not gate on phase in this engine — still flips
    const fromPlace = passTurn(placing);
    expect(fromPlace.currentPlayer).toBe('player2');
  });
});
