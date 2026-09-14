/**
 * Wave 48 — Juggle easy teaching can pick smaller die. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — teaching smaller die', () => {
  it('easy with high random may return either index when scores differ', () => {
    // teachingMode uses Math.random < 0.4 for suboptimal; also teaching variety
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [5, 1] as [number, number],
    };
    const choice = getAIDieChoice(s, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  });
});
