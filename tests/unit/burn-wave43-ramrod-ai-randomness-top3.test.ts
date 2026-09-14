/**
 * Wave 43 — ramrod AI randomness leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, isValidPlacement } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — AI randomness', () => {
  it('seeded random still isValidPlacement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(isValidPlacement(s, move!.rodId, move!.boxId, move!.slot)).toBe(true);
  });
});
