/**
 * Wave 59 Contig/SD residual — Sum isAITurn matrix leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { isAITurn } from '../../src/games/sum-dominoes/ai';

describe('Wave 59 sum — isAITurn matrix', () => {
  it('false for null/gameOver; true for AI seat', () => {
    const base = createInitialState();
    expect(isAITurn(base, null)).toBe(false);
    expect(
      isAITurn({ ...base, phase: 'gameOver', winner: 'player1' }, 'player2')
    ).toBe(false);
    expect(isAITurn({ ...base, currentPlayer: 'player2' }, 'player2')).toBe(
      true
    );
    expect(isAITurn(base, 'player2')).toBe(false); // player1 to move
  });
});
