/**
 * Wave 45 — Star isGameOver true for winner with non-over phase
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { isGameOver } from '../../src/games/star-track/rules';

describe('Wave 45 Star — isGameOver winner or phase', () => {
  it('true when winner is set even if phase lagged', () => {
    expect(
      isGameOver({
        ...createInitialState(),
        winner: 'player2',
        phase: 'selectChain',
      })
    ).toBe(true);
    expect(isGameOver(createInitialState())).toBe(false);
  });
});
