/**
 * Wave 45 — Star Track easy falls back to best when random≥0.4
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — easy best fallback', () => {
  it('easy with random 0.5 takes the longer chain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = {
      ...createInitialState(),
      player1Position: 1,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 5 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    expect(getAIChainChoice(state, 'player1', 'easy')?.chainIndex).toBe(1);
  });
});
