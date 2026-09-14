/**
 * Overnight TOKENMAXX — Calla easy AI opening legal leftover. Tests-only.
 * Uses easy only — hard minimax depth-6 risks CI timeout (#213).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';
import { getAIMove } from '../../src/games/calla/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight calla — easy opening', () => {
  it('easy returns a valid pit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPits(s)).toContain(move!.pit);
  });
});
