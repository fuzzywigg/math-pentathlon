/**
 * Wave 43 — Contig isAITurn mode gates leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { isAITurn } from '../../src/games/contig-60/ai';

describe('Wave 43 contig — isAITurn gates', () => {
  it('false for hvh/null/wrong seat/gameOver', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(open, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(open, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(open, 'player1', 'human-vs-ai')).toBe(true);
    const over = { ...open, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
