/**
 * Wave 45 — Star Track isAITurn false when winner set with lagged draw phase
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { isAITurn } from '../../src/games/star-track/ai';

describe('Wave 45 Star AI — lagged winner gate', () => {
  it('isGameOver true via winner even if phase still drawChains', () => {
    const state = {
      ...createInitialState(),
      phase: 'drawChains' as const,
      winner: 'player1' as const,
      currentPlayer: 'player1' as const,
    };
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(false);
  });
});
