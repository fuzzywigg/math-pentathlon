/**
 * Wave 41 — Ramrod isValidPlacement reject matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
  getValidPlacements,
  selectRod,
  placeRod,
} from '../../src/games/ramrod/rules';
import type { RamrodState, Rod, SumBox } from '../../src/games/ramrod/types';

describe('Wave 41 ramrod — valid reject matrix', () => {
  it('rejects missing box or rod ids', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const boxId = [...state.boxes.keys()][0];
    expect(isValidPlacement(state, 'ghost-rod', boxId, 0)).toBe(false);
    expect(isValidPlacement(state, rodId, 'ghost-box', 0)).toBe(false);
  });

  it('rejects occupied slot', () => {
    let state = createInitialState();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    const placement = getValidPlacements(state, rodId)[0];
    expect(placement).toBeTruthy();
    state = placeRod(state, placement.boxId, placement.slot);

    // After place, player2's turn — try to place into same occupied slot with their rod
    const rod2 = state.playerRods.player2[0];
    expect(isValidPlacement(state, rod2, placement.boxId, placement.slot)).toBe(
      false
    );
  });

  it('rejects completed box', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const boxId = [...state.boxes.keys()][0];
    const boxes = new Map(state.boxes);
    const box = boxes.get(boxId)!;
    boxes.set(boxId, { ...box, completedBy: 'player2' });
    const completed: RamrodState = { ...state, boxes };
    expect(isValidPlacement(completed, rodId, boxId, 0)).toBe(false);
    expect(isValidPlacement(completed, rodId, boxId, 1)).toBe(false);
  });

  it('rejects rod length greater than target sum', () => {
    const state = createInitialState();
    // Find a short-target box and forge a long rod
    const shortBox = [...state.boxes.values()].reduce((a, b) =>
      a.targetSum <= b.targetSum ? a : b
    );
    const rods = new Map(state.rods);
    const longRod: Rod = {
      id: 'long-overflow',
      length: shortBox.targetSum + 1,
      color: '#000',
      owner: 'player1',
      position: null,
    };
    rods.set(longRod.id, longRod);
    const playerRods = {
      ...state.playerRods,
      player1: [...state.playerRods.player1, longRod.id],
    };
    const forged: RamrodState = { ...state, rods, playerRods };
    expect(
      isValidPlacement(forged, longRod.id, shortBox.id, 0)
    ).toBe(false);
  });

  it('rejects second rod that would not sum to target', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()][0];
    const rods = new Map(state.rods);
    const first: Rod = {
      id: 'seed-rod',
      length: 1,
      color: '#fff',
      owner: 'player2',
      position: { boxId: box.id, slot: 0 },
    };
    rods.set(first.id, first);
    const boxes = new Map(state.boxes);
    const seeded: SumBox = { ...box, rods: [first, null] };
    boxes.set(box.id, seeded);

    // Choose a length ≤ target that does not complete with the seed
    let wrongLen = 2;
    while (
      wrongLen === box.targetSum - 1 ||
      wrongLen > box.targetSum
    ) {
      wrongLen++;
      if (wrongLen > 10) break;
    }
    expect(wrongLen + first.length).not.toBe(box.targetSum);
    expect(wrongLen).toBeLessThanOrEqual(box.targetSum);

    const probe: Rod = {
      id: 'bad-sum',
      length: wrongLen,
      color: '#f00',
      owner: 'player1',
      position: null,
    };
    rods.set(probe.id, probe);
    const forged: RamrodState = { ...state, rods, boxes };
    expect(isValidPlacement(forged, probe.id, box.id, 1)).toBe(false);
  });

  it('getValidPlacements lists only slots that pass isValidPlacement', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const placements = getValidPlacements(state, rodId);
    expect(placements.length).toBeGreaterThan(0);
    for (const p of placements) {
      expect(isValidPlacement(state, rodId, p.boxId, p.slot)).toBe(true);
    }
  });
});
