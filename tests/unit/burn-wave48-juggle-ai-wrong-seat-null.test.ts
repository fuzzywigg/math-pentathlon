/**
 * Wave 48 — Juggle AI helpers null on wrong seat leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice, getAIShapeChoice, getAIPlacement, isAITurn } from '../../src/games/juggle/ai';

describe('Wave 48 juggle — AI wrong seat null', () => {
  it('all AI helpers null for player2 on p1 turn', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [2, 3] as [number, number],
    };
    expect(getAIDieChoice(selecting, 'player2')).toBeNull();
    const withCat = { ...selecting, selectedCategory: 'domino' as const };
    expect(getAIShapeChoice(withCat, 'player2')).toBeNull();
    const placing = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedCategory: 'monomino' as const,
      selectedShape: null,
    };
    expect(getAIPlacement(placing, 'player2')).toBeNull();
    expect(isAITurn(selecting, 'player2', 'human-vs-ai')).toBe(false);
  });
});
