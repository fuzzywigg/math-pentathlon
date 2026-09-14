/**
 * Overnight TOKENMAXX — Calla winner-without-phase leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { isGameOver } from '../../src/games/calla/rules';
import { isAITurn } from '../../src/games/calla/ai';

describe('Overnight calla — winner without gameOver phase', () => {
  it('isGameOver true; isAITurn false', () => {
    const s = { ...createInitialState(), winner: 'player1' as const, phase: 'selectPit' as const };
    expect(isGameOver(s)).toBe(true);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(false);
  });
});
