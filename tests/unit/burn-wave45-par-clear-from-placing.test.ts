/**
 * Wave 45 — Par 55 clearSelection from placing leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock, clearSelection } from '../../src/games/par-55/rules';

describe('Wave 45 par — clear selection', () => {
  it('clearSelection resets selectedBlock and phase', () => {
    const state = createInitialState();
    const placing = selectBlock(state, state.hands.player1[0].id);
    const cleared = clearSelection(placing);
    expect(cleared.selectedBlock).toBeNull();
    expect(cleared.phase).toBe('selectingBlock');
  });
});
