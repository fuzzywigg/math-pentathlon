/**
 * Wave 43 — Ramrod opening board targets + hand deal. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/ramrod/rules';
import { CONFIG, createBoxId } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — initial board targets', () => {
  it('creates 12 boxes with known target ladder', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(s.boxes.size).toBe(CONFIG.BOARD_ROWS * CONFIG.BOARD_COLS);
    expect(s.boxes.get(createBoxId(0, 0))?.targetSum).toBe(5);
    expect(s.boxes.get(createBoxId(0, 3))?.targetSum).toBe(8);
    expect(s.boxes.get(createBoxId(2, 0))?.targetSum).toBe(7);
    expect(s.boxes.get(createBoxId(2, 3))?.targetSum).toBe(10);
    expect(s.playerRods.player1).toHaveLength(5);
    expect(s.playerRods.player2).toHaveLength(5);
    expect(s.phase).toBe('selectingRod');
    expect(s.scores).toEqual({ player1: 0, player2: 0 });
  });
});
