/**
 * Wave 48 — Juggle easy teaching placement still legal. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie, isPlacementValid } from '../../src/games/juggle/rules';
import { getAIPlacement } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — teaching placement legal', () => {
  it('easy teaching with mid random returns valid placement for mono', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const placing = selectDie(
      { ...createInitialState(), phase: 'selectingShape' as const, currentDice: [1, 1] as [number, number] },
      0
    );
    const choice = getAIPlacement(placing, 'player1', 'easy');
    expect(choice).not.toBeNull();
    const withRot = { ...placing, selectedRotation: choice!.rotation, selectedFlipped: choice!.flipped };
    expect(isPlacementValid(withRot, choice!.position)).toBe(true);
  });
});
