/**
 * Wave 58 Contig/SD residual — Contig executeAITurn gameOver identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { executeAITurn } from '../../src/games/contig-60/ai';

describe('Wave 58 contig — AI gameOver identity', () => {
  it('returns same reference when phase is gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(executeAITurn(state, 'player1', 'hard')).toBe(state);
  });
});
