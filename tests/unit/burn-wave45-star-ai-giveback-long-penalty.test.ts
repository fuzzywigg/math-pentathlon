/**
 * Wave 45 — Star Track AI give-back long-chain penalty
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — give-back long penalty', () => {
  it('hard prefers keeping the 6 and giving the 2 mid-race', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: 3,
      player2Position: 3,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 6 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    expect(getAIChainChoice(state, 'player1', 'hard')?.chainIndex).toBe(1);
  });
});
