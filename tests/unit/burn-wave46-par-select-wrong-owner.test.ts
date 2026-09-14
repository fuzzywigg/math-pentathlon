/**
 * Wave 46 — Par 55 selectBlock rejects opponent hand leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';

describe('Wave 46 par — select wrong owner', () => {
  it('cannot select player2 hand block on player1 turn', () => {
    const state = createInitialState();
    const oppId = state.hands.player2[0].id;
    expect(selectBlock(state, oppId)).toBe(state);
  });
});
