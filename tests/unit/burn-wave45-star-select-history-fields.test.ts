/**
 * Wave 45 — Star Track selectChain moveHistory field matrix
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { selectChain } from '../../src/games/star-track/rules';

describe('Wave 45 Star — select history fields', () => {
  it('records from/to/chainUsed/moveNumber on mid-track advance', () => {
    const state = {
      ...createInitialState(),
      player1Position: 4,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 3 as const, id: 10 },
        { length: 1 as const, id: 11 },
      ],
      currentPlayer: 'player1' as const,
    };
    const next = selectChain(state, 0);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0]).toMatchObject({
      player: 'player1',
      chainUsed: 3,
      fromPosition: 4,
      toPosition: 7,
      moveNumber: 1,
    });
  });
});
