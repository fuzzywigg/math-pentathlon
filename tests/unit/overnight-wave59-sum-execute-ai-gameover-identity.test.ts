/**
 * Wave 59 Contig/SD residual — Sum executeAITurn gameOver identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { executeAITurn } from '../../src/games/sum-dominoes/ai';

describe('Wave 59 sum — AI gameOver identity', () => {
  it('leaves gameOver state unchanged', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      passCount: 2,
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.passCount).toBe(2);
  });
});
