/**
 * Wave 43 — Ramrod clearSelection when already selectingRod. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, clearSelection, selectRod } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — clearSelection', () => {
  it('from selectingRod stays selectingRod; from placing returns selecting', () => {
    const open = createInitialState();
    const cleared = clearSelection(open);
    expect(cleared.phase).toBe('selectingRod');
    expect(cleared.selectedRod).toBeNull();
    const placing = selectRod(open, open.playerRods.player1[0]);
    const back = clearSelection(placing);
    expect(back.phase).toBe('selectingRod');
    expect(back.selectedRod).toBeNull();
  });
});
