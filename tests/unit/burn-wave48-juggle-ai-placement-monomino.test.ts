/**
 * Wave 48 — Juggle getAIPlacement for monomino placing phase. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { getAIPlacement } from '../../src/games/juggle/ai';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — AI placement monomino', () => {
  it('returns in-bounds placement for auto-selected monomino', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 4] as [number, number],
    };
    const placing = selectDie(selecting, 0);
    expect(placing.phase).toBe('placing');
    const choice = getAIPlacement(placing, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect(choice!.position.row).toBeGreaterThanOrEqual(0);
    expect(choice!.position.col).toBeGreaterThanOrEqual(0);
    expect(SHAPE_POOLS.monomino[0].id).toBeTruthy();
  });
});
