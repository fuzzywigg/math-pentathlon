/**
 * Overnight HEAVY after #214/#215 — Juggle hard shape after die select. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { getAIShapeChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight juggle — hard shape', () => {
  it('returns a shape once category selected', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [3, 4] as [number, number],
    };
    s = selectDie(s, 0);
    expect(s.selectedCategory).not.toBeNull();
    const choice = getAIShapeChoice(s, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(choice!.shape).toBeTruthy();
  }, 15_000);
});
