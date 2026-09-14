/**
 * Wave 45 — Star Track AI prefers longer when neither wins
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — prefer longer neither wins', () => {
  it('hard picks 5 over 3 when both short of the goal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: 2,
      player2Position: 1,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 3 as const, id: 1 },
        { length: 5 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    expect(getAIChainChoice(state, 'player1', 'hard')?.chainIndex).toBe(1);
  });
});
