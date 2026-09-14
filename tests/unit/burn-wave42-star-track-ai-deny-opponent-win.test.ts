/**
 * Wave 42 — Star Track AI avoids giving opponent a winning chain.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Star Track AI — deny opponent', () => {
  it('hard takes longer chain rather than gifting opponent a win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Opponent needs 4; chains 6 and 2 — taking 2 gifts the 6 (winning for opp).
    const state = {
      ...createInitialState(),
      player1Position: 3,
      player2Position: TRACK_LENGTH - 4,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 2 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice?.chainIndex).toBe(0);
  });
});
