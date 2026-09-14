/**
 * Wave 45 — Star Track executeAITurn identity when already gameOver
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { executeAITurn } from '../../src/games/star-track/ai';

describe('Wave 45 Star AI — gameOver identity', () => {
  it('does not grow history from gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
      player2Position: 12,
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.moveHistory).toHaveLength(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });
});
