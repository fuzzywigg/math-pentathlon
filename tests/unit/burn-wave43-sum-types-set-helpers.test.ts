/**
 * Wave 43 — Sum Dominoes set/helpers leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createDominoSet,
  getDominoPips,
  isDouble,
  getDiceSum,
  getOpponent,
  CONFIG,
} from '../../src/games/sum-dominoes/types';

describe('Wave 43 sum-dominoes — types helpers', () => {
  it('double-six set has 28; doubles and pips; dice sum', () => {
    const set = createDominoSet();
    expect(set).toHaveLength(28);
    const doubles = set.filter(isDouble);
    expect(doubles).toHaveLength(7);
    expect(getDominoPips(doubles.find((d) => d.face1 === 6)!)).toBe(12);
    expect(getDiceSum([3, 5])).toBe(8);
    expect(getOpponent('player1')).toBe('player2');
    expect(CONFIG.BOARD_SIZE).toBe(11);
    expect(CONFIG.STARTING_HAND_SIZE).toBe(7);
  });
});
