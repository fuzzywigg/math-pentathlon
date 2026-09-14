/**
 * Wave 45 — Star Track getProgress player2 mid-ladder
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getProgress } from '../../src/games/star-track/rules';

describe('Wave 45 Star — p2 mid progress', () => {
  it('reports 50% when player2 is at TRACK_LENGTH/2', () => {
    const state = {
      ...createInitialState(),
      player2Position: TRACK_LENGTH / 2,
    };
    expect(getProgress(state, 'player2')).toBe(50);
    expect(getProgress(state, 'player1')).toBe(0);
  });
});
