/**
 * Wave 45 — Star Track hard randomness still legal index
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — hard random legal', () => {
  it('hard with random<0.02 still returns 0 or 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 4 as const, id: 1 },
        { length: 5 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
  });
});
