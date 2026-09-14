/**
 * Wave 43 — Sum Dominoes getRemainingCount matrix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getRemainingCount } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';

describe('Wave 43 sum-dominoes — remaining count', () => {
  it('opening hands match STARTING_HAND_SIZE; empty is 0', () => {
    const open = createInitialState();
    expect(getRemainingCount(open, 'player1')).toBe(CONFIG.STARTING_HAND_SIZE);
    expect(getRemainingCount(open, 'player2')).toBe(CONFIG.STARTING_HAND_SIZE);
    const empty = {
      ...open,
      hands: { player1: [], player2: open.hands.player2 },
    };
    expect(getRemainingCount(empty, 'player1')).toBe(0);
  });
});
