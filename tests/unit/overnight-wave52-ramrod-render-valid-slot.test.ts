/**
 * Overnight HEAVY leftover after #234 — Ramrod valid slot highlight. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod, getValidPlacements } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — valid slot class', () => {
  it('marks valid slots when a rod is selected', () => {
    const open = createInitialState();
    const rodId = open.playerRods.player1[0];
    const placing = selectRod(open, rodId);
    const valids = getValidPlacements(placing, rodId);
    expect(valids.length).toBeGreaterThan(0);
    const el = renderBoard(placing, () => undefined);
    expect(el.querySelectorAll('.ramrod-slot.valid').length).toBe(valids.length);
  });
});
