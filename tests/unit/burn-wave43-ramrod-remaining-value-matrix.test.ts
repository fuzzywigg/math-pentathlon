/**
 * Wave 43 — Ramrod getRemainingValue / getBoxSum matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { type Rod, type SumBox } from '../../src/games/ramrod/types';
import {
  createInitialState,
  getRemainingValue,
  getBoxSum,
} from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — remaining/box sum', () => {
  it('empty / one-slot / both-filled cases', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()][0];
    expect(getRemainingValue(box)).toBe(box.targetSum);
    expect(getBoxSum(box)).toBeNull();

    const rodA: Rod = { id: 'a', length: 3, color: '#a', owner: 'player1', position: null };
    const one: SumBox = { ...box, rods: [rodA, null] };
    expect(getRemainingValue(one)).toBe(box.targetSum - 3);
    expect(getBoxSum(one)).toBeNull();

    const rodB: Rod = { id: 'b', length: 2, color: '#b', owner: 'player2', position: null };
    const both: SumBox = { ...box, rods: [rodA, rodB] };
    expect(getBoxSum(both)).toBe(5);
    expect(getRemainingValue(both)).toBe(box.targetSum);
  });
});
