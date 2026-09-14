/**
 * Wave 45 — Par 55 selectBlock wrong-phase identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';

describe('Wave 45 par — select wrong phase', () => {
  it('selectBlock is identity when phase is placingBlock', () => {
    const state = createInitialState();
    const id = state.hands.player1[0].id;
    const placing = selectBlock(state, id);
    expect(placing.phase).toBe('placingBlock');
    expect(selectBlock(placing, id)).toBe(placing);
  });

  it('selectBlock is identity for missing hand id', () => {
    const state = createInitialState();
    expect(selectBlock(state, 'ghost-block')).toBe(state);
  });
});
