/**
 * Overnight HEAVY after #214/#215 — Juggle medium die choice leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight juggle — medium die', () => {
  it('returns index 0|1 on selectingShape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [2, 5] as [number, number],
    };
    const choice = getAIDieChoice(selecting, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  }, 15_000);
});
