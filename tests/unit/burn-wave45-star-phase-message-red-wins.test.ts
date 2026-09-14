/**
 * Wave 45 — Star Track getPhaseMessage Red wins
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getPhaseMessage } from '../../src/games/star-track/rules';

describe('Wave 45 Star — phase message Red wins', () => {
  it('announces Red wins for player2', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getPhaseMessage(state)).toBe('Red wins!');
  });
});
