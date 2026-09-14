/**
 * Wave 48 — Juggle medium randomness still returns die. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — medium random band', () => {
  it('medium with random below threshold picks top', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [3, 4] as [number, number],
    };
    expect(getAIDieChoice(s, 'player1', 'medium')).not.toBeNull();
  });
});
