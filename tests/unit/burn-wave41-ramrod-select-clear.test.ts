/**
 * Wave 41 — Ramrod selectRod / clearSelection leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectRod,
  clearSelection,
} from '../../src/games/ramrod/rules';

describe('Wave 41 ramrod — select / clear', () => {
  it('selectRod identity when phase is not selectingRod', () => {
    const state = createInitialState();
    const placing = {
      ...state,
      phase: 'placingRod' as const,
      selectedRod: state.playerRods.player1[0],
    };
    expect(selectRod(placing, state.playerRods.player1[1])).toBe(placing);
  });

  it('selectRod identity for opponent or unknown rod', () => {
    const state = createInitialState();
    expect(selectRod(state, state.playerRods.player2[0])).toBe(state);
    expect(selectRod(state, 'ghost-rod')).toBe(state);
  });

  it('selectRod advances; clearSelection resets', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const selected = selectRod(state, rodId);
    expect(selected.selectedRod).toBe(rodId);
    expect(selected.phase).toBe('placingRod');
    const cleared = clearSelection(selected);
    expect(cleared.selectedRod).toBeNull();
    expect(cleared.phase).toBe('selectingRod');
  });
});
