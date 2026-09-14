/**
 * Wave 42 — Star Track easy teaching may attach a win-miss hint.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Star Track AI — teaching hint', () => {
  it('easy suboptimal pick can include a winning-miss hint', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // teaching suboptimal
    // Hint path uses opponent position in source — keep both near finish.
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 2,
      player2Position: TRACK_LENGTH - 2,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 1 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    const choice = getAIChainChoice(state, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
    if (choice!.chainIndex === 1 && choice!.hint) {
      expect(choice!.hint).toMatch(/won|winning|could have|further/i);
    }
  });
});
