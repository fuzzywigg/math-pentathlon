/**
 * Wave 45 — Star Track executeAITurn empty bucket settles
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { executeAITurn } from '../../src/games/star-track/ai';

describe('Wave 45 Star AI — empty bucket settle', () => {
  it('draw with empty bucket ends game by position without select', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [],
      player1Position: 8,
      player2Position: 3,
      currentPlayer: 'player1' as const,
      phase: 'drawChains' as const,
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.moveHistory).toHaveLength(0);
  });
});
