/**
 * Wave 42 — Star Track easy teaching returns null then takes best chain.
 * Covers getTeachingChoice fallthrough (random ≥ 0.4). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Star Track AI — easy best path', () => {
  it('easy with random≥0.4 picks the higher-scoring chain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 1 as const, id: 2 },
      ],
    };
    expect(getAIChainChoice(state, 'player1', 'easy')?.chainIndex).toBe(0);
  });
});
