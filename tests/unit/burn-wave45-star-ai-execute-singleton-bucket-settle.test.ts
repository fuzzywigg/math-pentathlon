/**
 * Wave 45 — Star Track executeAITurn singleton bucket settles
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { executeAITurn } from '../../src/games/star-track/ai';

describe('Wave 45 Star AI — singleton bucket settle', () => {
  it('draw with one remaining chain ends like empty (<2)', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [{ length: 4 as const, id: 7 }],
      player1Position: 4,
      player2Position: 9,
      currentPlayer: 'player1' as const,
      phase: 'drawChains' as const,
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });
});
