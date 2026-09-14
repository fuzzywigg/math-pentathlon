/**
 * Wave 43 — Ramrod second-slot wrong sum reject leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { type Rod } from '../../src/games/ramrod/types';
import {
  createInitialState,
  selectRod,
  isValidPlacement,
  placeRod,
} from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — wrong sum reject', () => {
  it('second slot that would not hit target is invalid', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()].find((b) => b.targetSum === 8)!;
    const seed: Rod = {
      id: 'seed',
      length: 3,
      color: '#x',
      owner: 'player2',
      position: { boxId: box.id, slot: 0 },
    };
    const bad: Rod = {
      id: 'bad',
      length: 3,
      color: '#y',
      owner: 'player1',
      position: null,
    };
    const rods = new Map(state.rods);
    rods.set(seed.id, seed);
    rods.set(bad.id, bad);
    const boxes = new Map(state.boxes);
    boxes.set(box.id, { ...box, rods: [seed, null] });
    const forged = {
      ...state,
      boxes,
      rods,
      playerRods: { ...state.playerRods, player1: [bad.id] },
    };
    expect(isValidPlacement(forged, bad.id, box.id, 1)).toBe(false);
    const placing = selectRod(forged, bad.id);
    expect(placeRod(placing, box.id, 1)).toBe(placing);
  });
});
