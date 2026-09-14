/**
 * Wave 44 — Sum Dominoes CONFIG / types helpers invariants. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  CONFIG,
  createDominoSet,
  getDominoPips,
  isDouble,
  getOpponent,
  getDiceSum,
  shuffleArray,
} from '../../src/games/sum-dominoes/types';

describe('Wave 44 sum-dominoes — CONFIG invariants', () => {
  it('board geometry centers and hand size are consistent', () => {
    expect(CONFIG.BOARD_SIZE).toBe(11);
    expect(CONFIG.CENTER_ROW).toBe(5);
    expect(CONFIG.CENTER_COL).toBe(5);
    expect(CONFIG.CENTER_ROW).toBe(Math.floor(CONFIG.BOARD_SIZE / 2));
    expect(CONFIG.CENTER_COL).toBe(Math.floor(CONFIG.BOARD_SIZE / 2));
    expect(CONFIG.STARTING_HAND_SIZE).toBe(7);
    expect(CONFIG.MAX_FACE_VALUE).toBe(6);
  });

  it('createDominoSet yields 28 unique double-six tiles', () => {
    const set = createDominoSet();
    expect(set).toHaveLength(28);
    const ids = new Set(set.map((d) => d.id));
    expect(ids.size).toBe(28);
    expect(set.every((d) => d.owner === null)).toBe(true);
    expect(set.filter((d) => isDouble(d))).toHaveLength(7);
  });

  it('getDominoPips and isDouble agree on doubles', () => {
    const set = createDominoSet();
    for (const d of set) {
      expect(getDominoPips(d)).toBe(d.face1 + d.face2);
      expect(isDouble(d)).toBe(d.face1 === d.face2);
    }
  });

  it('getOpponent swaps seats and getDiceSum adds faces', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getDiceSum([1, 6])).toBe(7);
    expect(getDiceSum([6, 6])).toBe(12);
  });

  it('shuffleArray returns same multiset without mutating input', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const out = shuffleArray(input);
    expect(input).toEqual(copy);
    expect([...out].sort()).toEqual([...copy].sort());
    expect(out).toHaveLength(input.length);
  });
});
