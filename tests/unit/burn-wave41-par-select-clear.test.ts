/**
 * Wave 41 — Par 55 selectBlock / clearSelection leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  clearSelection,
} from '../../src/games/par-55/rules';

describe('Wave 41 par — select / clear', () => {
  it('selectBlock identity when phase is not selectingBlock', () => {
    const state = createInitialState();
    const placing = {
      ...state,
      phase: 'placingBlock' as const,
      selectedBlock: state.hands.player1[0].id,
    };
    expect(selectBlock(placing, state.hands.player1[1].id)).toBe(placing);
  });

  it('selectBlock identity for missing / opponent block id', () => {
    const state = createInitialState();
    expect(selectBlock(state, 'ghost-block')).toBe(state);
    const oppId = state.hands.player2[0].id;
    expect(selectBlock(state, oppId)).toBe(state);
  });

  it('selectBlock advances to placingBlock; clearSelection resets', () => {
    const state = createInitialState();
    const id = state.hands.player1[0].id;
    const selected = selectBlock(state, id);
    expect(selected.selectedBlock).toBe(id);
    expect(selected.phase).toBe('placingBlock');
    const cleared = clearSelection(selected);
    expect(cleared.selectedBlock).toBeNull();
    expect(cleared.phase).toBe('selectingBlock');
  });
});
