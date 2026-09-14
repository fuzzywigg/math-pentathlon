/**
 * Wave 59 Contig/SD residual — Contig isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { isAITurn } from '../../src/games/contig-60/ai';

describe('Wave 59 contig — isAITurn matrix', () => {
  it('false for hvh / null ai / gameOver; true for AI seat rolling', () => {
    const base = createInitialState();
    expect(isAITurn(base, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(base, null, 'human-vs-ai')).toBe(false);
    expect(
      isAITurn(
        { ...base, phase: 'gameOver', winner: 'player1' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(false);
    expect(
      isAITurn(
        { ...base, currentPlayer: 'player2' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(true);
  });
});
