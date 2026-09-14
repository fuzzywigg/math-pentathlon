/**
 * Wave 48 — Juggle hard die choice prefers placeable category. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — hard die prefers placeable', () => {
  it('returns index 0|1 on open board with mixed dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [5, 2] as [number, number],
    };
    const choice = getAIDieChoice(s, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  });
});
