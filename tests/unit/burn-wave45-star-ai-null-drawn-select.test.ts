/**
 * Wave 45 — Star Track getAIChainChoice null when drawnChains is null
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

describe('Wave 45 Star AI — null drawn in selectChain', () => {
  it('returns null when phase is selectChain but drawnChains is null', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: null,
      currentPlayer: 'player1' as const,
    };
    expect(getAIChainChoice(state, 'player1', 'hard')).toBeNull();
  });
});
