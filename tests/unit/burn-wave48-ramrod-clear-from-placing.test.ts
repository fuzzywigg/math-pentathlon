/**
 * Wave 48 — Ramrod clearSelection from placingRod leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod, clearSelection } from '../../src/games/ramrod/rules';

describe('Wave 48 ramrod — clear from placing', () => {
  it('returns selectingRod with null selection', () => {
    const selected = selectRod(createInitialState(), createInitialState().playerRods.player1[0]);
    // use same state's rod
    const s = createInitialState();
    const mid = selectRod(s, s.playerRods.player1[0]);
    const cleared = clearSelection(mid);
    expect(cleared.phase).toBe('selectingRod');
    expect(cleared.selectedRod).toBeNull();
    void selected;
  });
});
