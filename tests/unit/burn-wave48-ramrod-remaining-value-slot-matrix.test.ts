/**
 * Wave 48 — Ramrod getRemainingValue slot0/slot1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getRemainingValue } from '../../src/games/ramrod/rules';
import type { SumBox, Rod } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — remaining value', () => {
  it('computes need from either occupied slot', () => {
    const s = createInitialState();
    const box = s.boxes.get('box-0-0')!;
    const rod: Rod = {
      id: 'r-test',
      length: 3,
      color: '#000',
      owner: 'player1',
      position: { boxId: box.id, slot: 0 },
    };
    const slot0: SumBox = { ...box, rods: [rod, null] };
    const slot1: SumBox = { ...box, rods: [null, rod] };
    expect(getRemainingValue(slot0)).toBe(box.targetSum - 3);
    expect(getRemainingValue(slot1)).toBe(box.targetSum - 3);
  });
});
