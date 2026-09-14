/**
 * Wave 43 — Ramrod rod catalog + CONFIG leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  CONFIG,
  ROD_COLORS,
  ROD_NAMES,
  createRod,
  createRodSet,
  createBoxId,
  getOpponent,
  shuffleArray,
} from '../../src/games/ramrod/types';

describe('Wave 43 ramrod — types rod catalog', () => {
  it('CONFIG target 24 with 3x4 board and 5 starting rods', () => {
    expect(CONFIG.TARGET_SCORE).toBe(24);
    expect(CONFIG.BOARD_ROWS).toBe(3);
    expect(CONFIG.BOARD_COLS).toBe(4);
    expect(CONFIG.STARTING_RODS_PER_PLAYER).toBe(5);
  });

  it('ROD_COLORS/NAMES cover lengths 1..10', () => {
    for (let len = 1; len <= 10; len++) {
      expect(ROD_COLORS[len]).toMatch(/^#/);
      expect(ROD_NAMES[len]).toBeTruthy();
    }
  });

  it('createRodSet counts and createRod identity', () => {
    const set = createRodSet();
    expect(set.length).toBe(8 + 6 + 5 + 4 + 4 + 3 + 3 + 2 + 2 + 2);
    expect(set.filter((r) => r.length === 1)).toHaveLength(8);
    const rod = createRod('x', 5);
    expect(rod.color).toBe(ROD_COLORS[5]);
    expect(rod.owner).toBeNull();
    expect(createBoxId(1, 2)).toBe('box-1-2');
    expect(getOpponent('player1')).toBe('player2');
  });

  it('shuffleArray permutes without losing elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});
