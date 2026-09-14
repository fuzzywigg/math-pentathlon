/**
 * Wave 41 — Ramrod isValidPlacement / getValidPlacements leftovers.
 * Tests-only. No product inventing.
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

describe('Wave 41 Ramrod — placement bounds', () => {
  it('rejects unknown rod/box and occupied or completed slots', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    expect(isValidPlacement(state, 'missing', 'box-0-0', 0)).toBe(false);
    expect(isValidPlacement(state, rodId, 'no-box', 0)).toBe(false);

    // Occupy slot then reject
    let s = selectRod(state, rodId);
    const { boxId, slot } = getValidPlacements(s, rodId)[0];
    s = placeRod(s, boxId, slot);
    // After flip to p2 — use p1 rod on completed/occupied from a fresh select frame
    const otherRod = s.playerRods.player2[0];
    // slot now occupied for that box
    expect(isValidPlacement(s, otherRod, boxId, slot)).toBe(false);
  });

  it('rejects rod longer than targetSum', () => {
    const state = createInitialState();
    // Find smallest target box and a long rod if available
    const boxes = [...state.boxes.values()];
    const small = boxes.reduce((a, b) =>
      a.targetSum <= b.targetSum ? a : b
    );
    // Forge a long rod into player hand
    const long: Rod = {
      id: 'long-test',
      length: 99,
      color: '#000',
      owner: 'player1',
      position: null,
    };
    const rods = new Map(state.rods);
    rods.set(long.id, long);
    const forged: RamrodState = {
      ...state,
      rods,
      playerRods: {
        ...state.playerRods,
        player1: [...state.playerRods.player1, long.id],
      },
    };
    expect(isValidPlacement(forged, long.id, small.id, 0)).toBe(false);
  });

  it('rejects second rod that would not equal targetSum', () => {
    const state = createInitialState();
    const boxId = 'box-0-0';
    const box = state.boxes.get(boxId)!;
    const seed: Rod = {
      id: 'seed',
      length: 2,
      color: '#fff',
      owner: 'player2',
      position: { boxId, slot: 0 },
    };
    const rods = new Map(state.rods);
    rods.set(seed.id, seed);
    const boxes = new Map(state.boxes);
    boxes.set(boxId, { ...box, rods: [seed, null] });
    const forged: RamrodState = { ...state, rods, boxes };

    // Need rod that does NOT complement
    const wrong = state.playerRods.player1.find((id) => {
      const r = forged.rods.get(id)!;
      return r.length + 2 !== box.targetSum && r.length <= box.targetSum;
    });
    if (wrong) {
      expect(isValidPlacement(forged, wrong, boxId, 1)).toBe(false);
    }
    const right = state.playerRods.player1.find(
      (id) => forged.rods.get(id)!.length + 2 === box.targetSum
    );
    if (right) {
      expect(isValidPlacement(forged, right, boxId, 1)).toBe(true);
    }
  });

  it('getValidPlacements lists only legal box/slot pairs', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const placements = getValidPlacements(state, rodId);
    expect(placements.length).toBeGreaterThan(0);
    for (const p of placements) {
      expect(isValidPlacement(state, rodId, p.boxId, p.slot)).toBe(true);
      expect([0, 1]).toContain(p.slot);
      expect(state.boxes.has(p.boxId)).toBe(true);
    }
  });

  it('completed box rejects further placements', () => {
    const state = createInitialState();
    const boxId = 'box-1-1';
    const box = state.boxes.get(boxId)!;
    const r0: Rod = {
      id: 'a',
      length: 3,
      color: '#a',
      owner: 'player1',
      position: { boxId, slot: 0 },
    };
    const r1: Rod = {
      id: 'b',
      length: box.targetSum - 3,
      color: '#b',
      owner: 'player1',
      position: { boxId, slot: 1 },
    };
    const rods = new Map(state.rods);
    rods.set(r0.id, r0);
    rods.set(r1.id, r1);
    const boxes = new Map(state.boxes);
    const done: SumBox = {
      ...box,
      rods: [r0, r1],
      completedBy: 'player1',
    };
    boxes.set(boxId, done);
    const forged: RamrodState = { ...state, rods, boxes };
    const rodId = forged.playerRods.player1[0];
    expect(isValidPlacement(forged, rodId, boxId, 0)).toBe(false);
    expect(
      getValidPlacements(forged, rodId).every((p) => p.boxId !== boxId)
    ).toBe(true);
  });
});
