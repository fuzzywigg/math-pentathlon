/**
 * Wave 45 — Star Track AI exact finish while denying opponent-winning gift
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — exact plus deny', () => {
  it('picks exact 3 over 6 when opponent also needs 6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 3,
      player2Position: TRACK_LENGTH - 6,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 3 as const, id: 1 },
        { length: 6 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    expect(getAIChainChoice(state, 'player1', 'hard')?.chainIndex).toBe(0);
  });
});
