/**
 * Wave 48 — Juggle hard considerHoles still returns placement. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { getAIPlacement } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — hard holes path', () => {
  it('hard mono placement returns rotation/flipped fields', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = selectDie(
      { ...createInitialState(), phase: 'selectingShape' as const, currentDice: [1, 2] as [number, number] },
      0
    );
    const choice = getAIPlacement(placing, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(typeof choice!.flipped).toBe('boolean');
    expect([0, 90, 180, 270]).toContain(choice!.rotation);
  });
});
