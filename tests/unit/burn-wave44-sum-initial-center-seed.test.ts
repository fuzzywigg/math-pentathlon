/**
 * Wave 44 — Sum Dominoes opening center seed leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { createInitialState } from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Sum Dominoes — initial center seed', () => {
  it('deals 7+7 and seeds center', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const s = createInitialState();
    expect(s.hands.player1).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(s.hands.player2).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(s.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]).not.toBeNull();
    expect(s.phase).toBe('rolling');
    expect(s.passCount).toBe(0);
  });

  it('hands are disjoint from center seed id', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const s = createInitialState();
    const seed = s.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]!;
    const handIds = new Set(
      [...s.hands.player1, ...s.hands.player2].map((d) => d.id)
    );
    expect(handIds.has(seed.domino.id)).toBe(false);
  });
});
