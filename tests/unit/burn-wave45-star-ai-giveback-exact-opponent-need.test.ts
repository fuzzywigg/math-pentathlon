/**
 * Wave 45 — Star Track give-back penalty when otherChain.length === opponentNeeds
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — give-back exact opponent need', () => {
  it('avoids gifting the exact chain opponent needs to finish', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: 4,
      player2Position: TRACK_LENGTH - 5, // needs exactly 5
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 4 as const, id: 1 },
        { length: 5 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    // Picking 4 gives opponent 5 (exact finish) → extra -20; picking 5 gives 4 (not enough)
    expect(getAIChainChoice(state, 'player1', 'hard')?.chainIndex).toBe(1);
  });
});
