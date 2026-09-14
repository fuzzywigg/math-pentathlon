/**
 * Wave 42 leftovers D — contig-60 rollDice export bounds. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { rollDice, CONFIG } from '../../src/games/contig-60/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 D contig — rollDice export', () => {
  it('returns three dice in 1..6 with deterministic random spy', () => {
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0).mockReturnValueOnce(0.5).mockReturnValueOnce(0.999);
    expect(rollDice()).toEqual([1, 4, 6]);
  });

  it('CONFIG board / alignment thresholds stay coherent', () => {
    expect(CONFIG.GRID_ROWS * CONFIG.GRID_COLS).toBe(60);
    expect(CONFIG.WIN_BY_ALIGNMENT).toBe(5);
    expect(CONFIG.MAX_CONSECUTIVE_PASSES).toBe(3);
  });
});
