/**
 * Overnight TOKENMAXX — Hex-a-Gone isGameOver winner-only leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { isGameOver } from '../../src/games/hex-a-gone/rules';
import { isAITurn } from '../../src/games/hex-a-gone/ai';

describe('Overnight hexagone — winner-only gameOver', () => {
  it('winner set with selectBlocks phase is over; AI false', () => {
    const s = { ...createInitialState(), winner: 'player2' as const, phase: 'selectBlocks' as const };
    expect(isGameOver(s)).toBe(true);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(false);
  });
});
