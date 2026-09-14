/**
 * Wave 40 — Ramrod completed/occupied slot reject + remaining value.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
  placeRod,
  getRemainingValue,
  getBoxSum,
  selectRod,
} from '../../src/games/ramrod/rules';
import type { SumBox, Rod } from '../../src/games/ramrod/types';

describe('Wave 40 ramrod — placement rejects / remaining', () => {
  it('completedBy and occupied slot reject', () => {
    const state = createInitialState();
    const boxId = [...state.boxes.keys()][0];
    const rodId = [...state.rods.keys()][0];
    const box = state.boxes.get(boxId)!;
    const rod = state.rods.get(rodId)!;

    const completedMap = new Map(state.boxes);
    completedMap.set(boxId, { ...box, completedBy: 'player1' });
    const completed = { ...state, boxes: completedMap };
    expect(isValidPlacement(completed, rodId, boxId, 0)).toBe(false);

    const occupiedMap = new Map(state.boxes);
    occupiedMap.set(boxId, {
      ...box,
      rods: [rod, null] as [Rod | null, Rod | null],
    });
    const occupied = { ...state, boxes: occupiedMap };
    expect(isValidPlacement(occupied, rodId, boxId, 0)).toBe(false);
  });

  it('placeRod wrong phase / no selection → identity', () => {
    const state = createInitialState();
    expect(placeRod(state, 'box-0', 0)).toBe(state);
    const selected = selectRod(state, [...state.rods.keys()][0]);
    // still need placingRod phase — if selectRod advances, try place ghost
    if (selected.phase === 'placingRod') {
      expect(placeRod(selected, 'ghost-box', 0)).toBe(selected);
    }
  });

  it('getRemainingValue / getBoxSum matrix', () => {
    const empty: SumBox = {
      id: 'b',
      targetSum: 10,
      rods: [null, null],
      completedBy: null,
      row: 0,
      col: 0,
    };
    expect(getRemainingValue(empty)).toBe(10);
    expect(getBoxSum(empty)).toBeNull();

    const rodA: Rod = {
      id: 'r1',
      length: 4,
      owner: null,
      position: null,
    };
    const one: SumBox = { ...empty, rods: [rodA, null] };
    expect(getRemainingValue(one)).toBe(6);
    expect(getBoxSum(one)).toBeNull();

    const rodB: Rod = { ...rodA, id: 'r2', length: 6 };
    const both: SumBox = { ...empty, rods: [rodA, rodB] };
    expect(getBoxSum(both)).toBe(10);
    expect(getRemainingValue({ ...empty, rods: [null, rodB] })).toBe(4);
  });
});
