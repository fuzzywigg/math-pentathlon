/**
 * Wave 43 TOKENMAXX — Sum Dominoes types/catalog leftovers (non-AI). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CONFIG,
  createDominoSet,
  getDominoPips,
  isDouble,
  getOpponent,
  rollDice,
  getDiceSum,
  shuffleArray,
} from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 sum-dominoes — types catalog', () => {
  it('CONFIG board/hand invariants', () => {
    expect(CONFIG.BOARD_SIZE).toBe(11);
    expect(CONFIG.STARTING_HAND_SIZE).toBe(7);
    expect(CONFIG.CENTER_ROW).toBe(5);
    expect(CONFIG.CENTER_COL).toBe(5);
    expect(CONFIG.MAX_FACE_VALUE).toBe(6);
  });

  it('createDominoSet yields 28 double-six tiles with unique ids', () => {
    const set = createDominoSet();
    expect(set).toHaveLength(28);
    expect(new Set(set.map((d) => d.id)).size).toBe(28);
    expect(set.filter((d) => isDouble(d))).toHaveLength(7);
    expect(getDominoPips(set.find((d) => d.face1 === 6 && d.face2 === 6)!)).toBe(12);
  });

  it('rollDice/getDiceSum/opponent/shuffle', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDice()).toEqual([1, 1]);
    expect(getDiceSum([3, 4])).toBe(7);
    expect(getOpponent('player1')).toBe('player2');
    const src = [1, 2, 3];
    expect(shuffleArray(src)).toHaveLength(3);
    expect(src).toEqual([1, 2, 3]);
  });
});
