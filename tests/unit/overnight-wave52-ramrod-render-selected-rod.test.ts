/**
 * Overnight HEAVY leftover after #234 — Ramrod selected rod wrapper class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod } from '../../src/games/ramrod/rules';
import { renderPlayerRods } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — selected rod', () => {
  it('marks selected rod wrapper as selected', () => {
    const open = createInitialState();
    const rodId = open.playerRods.player1[0];
    const placing = selectRod(open, rodId);
    const el = renderPlayerRods(placing, 'player1', () => undefined);
    expect(el.querySelectorAll('.ramrod-rod-wrapper.selected').length).toBe(1);
  });
});
