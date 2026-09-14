/**
 * Wave 45 — Star Track selectChain overshoot clamps history toPosition
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { selectChain } from '../../src/games/star-track/rules';

describe('Wave 45 Star — overshoot history clamp', () => {
  it('history toPosition equals TRACK_LENGTH on overshoot win', () => {
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 2,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 1 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    const next = selectChain(state, 0);
    expect(next.moveHistory[0].toPosition).toBe(TRACK_LENGTH);
    expect(next.player1Position).toBe(TRACK_LENGTH);
    expect(next.winner).toBe('player1');
  });
});
