/**
 * Wave 43 — Ramrod draw-from-pool after place keeps hand size. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectRod,
  placeRod,
  getValidPlacements,
} from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — draw after place', () => {
  it('hand size stays near 5 when pool has unused rods', () => {
    const open = createInitialState();
    const before = open.playerRods.player1.length;
    expect(before).toBe(5);
    const rodId = open.playerRods.player1[0];
    const placing = selectRod(open, rodId);
    const spot = getValidPlacements(placing, rodId)[0];
    const next = placeRod(placing, spot.boxId, spot.slot);
    expect(next.playerRods.player1.length).toBe(before);
    expect(next.playerRods.player1).not.toContain(rodId);
  });
});
