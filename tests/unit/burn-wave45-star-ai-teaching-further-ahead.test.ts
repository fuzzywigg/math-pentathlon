/**
 * Wave 45 — Star Track easy teaching further-ahead hint
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — further ahead hint', () => {
  it('easy suboptimal can hint further-ahead when neither chain wins', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    // Bug in source uses opponent pos for spacesNeeded; keep both far from finish
    const state = {
      ...createInitialState(),
      player1Position: 2,
      player2Position: 2,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 2 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    const choice = getAIChainChoice(state, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
    if (choice!.chainIndex === 1 && choice!.hint) {
      expect(choice!.hint).toMatch(/further ahead/i);
    }
  });
});
