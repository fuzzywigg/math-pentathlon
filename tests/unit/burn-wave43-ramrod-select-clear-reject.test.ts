/**
 * Wave 43 — Ramrod selectRod/clearSelection reject matrix. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  selectRod,
  clearSelection,
} from '../../src/games/ramrod/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — select/clear reject', () => {
  it('select own rod enters placingRod; ghost/opponent identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const own = s.playerRods.player1[0];
    const opp = s.playerRods.player2[0];
    const next = selectRod(s, own);
    expect(next.phase).toBe('placingRod');
    expect(next.selectedRod).toBe(own);
    expect(selectRod(s, opp)).toBe(s);
    expect(selectRod(s, 'ghost-rod')).toBe(s);
    const placing = { ...s, phase: 'placingRod' as const, selectedRod: own };
    expect(selectRod(placing, own)).toBe(placing);
  });

  it('clearSelection returns to selectingRod', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const selected = selectRod(s, s.playerRods.player1[0]);
    const cleared = clearSelection(selected);
    expect(cleared.selectedRod).toBeNull();
    expect(cleared.phase).toBe('selectingRod');
  });
});
