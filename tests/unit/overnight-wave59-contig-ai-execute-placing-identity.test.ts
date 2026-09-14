/**
 * Wave 59 Contig/SD residual — Contig executeAITurn placing identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { executeAITurn } from '../../src/games/contig-60/ai';

describe('Wave 59 contig — AI placing identity', () => {
  it('returns same reference when phase is placing', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [2, 3, 4] as [number, number, number],
    };
    expect(executeAITurn(state, 'player1', 'hard')).toBe(state);
  });
});
