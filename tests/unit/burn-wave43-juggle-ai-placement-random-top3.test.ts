/**
 * Wave 43 — getAIPlacement random top3 leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  selectDie,
} from '../../src/games/juggle/rules';
import { getAIPlacement } from '../../src/games/juggle/ai';
import { CONFIG, getShapesForDie } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — AI placement random', () => {
  it('medium placement stays on-board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let s = doRollDice(createInitialState());
    s = selectDie(s, 0);
    if (s.phase !== 'placing') {
      s = {
        ...s,
        selectedShape: getShapesForDie(s.currentDice![0])[0],
        phase: 'placing',
      };
    }
    const place = getAIPlacement(s, 'player1', 'medium');
    expect(place).not.toBeNull();
    expect(place!.position.row).toBeGreaterThanOrEqual(0);
    expect(place!.position.row).toBeLessThan(CONFIG.GRID_SIZE);
    expect(place!.position.col).toBeGreaterThanOrEqual(0);
    expect(place!.position.col).toBeLessThan(CONFIG.GRID_SIZE);
  });
});
