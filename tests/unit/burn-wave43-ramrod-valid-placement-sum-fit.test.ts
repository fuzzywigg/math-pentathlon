/**
 * Wave 43 — Ramrod isValidPlacement sum-fit matrix. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  selectRod,
  isValidPlacement,
  getValidPlacements,
  getRemainingValue,
  getBoxSum,
} from '../../src/games/ramrod/rules';
import { createBoxId, type Rod, type SumBox } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — valid placement sum fit', () => {
  it('opening rod has some valid placements; oversize rejected', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const rodId = s.playerRods.player1[0];
    const placements = getValidPlacements(s, rodId);
    expect(placements.length).toBeGreaterThan(0);
    const rod = s.rods.get(rodId)!;
    // forge a tiny-target check: rod longer than box target invalid
    for (const box of s.boxes.values()) {
      if (rod.length > box.targetSum) {
        expect(isValidPlacement(s, rodId, box.id, 0)).toBe(false);
      }
    }
  });

  it('getBoxSum null until both rods; getRemainingValue uses single rod', () => {
    const rodA: Rod = {
      id: 'a',
      length: 3,
      color: '#fff',
      owner: 'player1',
      position: { boxId: 'box-0-0', slot: 0 },
    };
    const empty: SumBox = {
      id: 'box-0-0',
      targetSum: 7,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    };
    expect(getBoxSum(empty)).toBeNull();
    expect(getRemainingValue(empty)).toBe(7);
    const half: SumBox = { ...empty, rods: [rodA, null] };
    expect(getBoxSum(half)).toBeNull();
    expect(getRemainingValue(half)).toBe(4);
    const full: SumBox = {
      ...empty,
      rods: [rodA, { ...rodA, id: 'b', length: 4 }],
    };
    expect(getBoxSum(full)).toBe(7);
    expect(getRemainingValue(full)).toBe(7); // both present → returns targetSum
  });
});
