/**
 * Overnight HEAVY after #214/#215 — Calla isAITurn gameOver leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { isAITurn } from '../../src/games/calla/ai';

describe('Overnight calla — isAITurn gameOver', () => {
  it('false when gameOver even if seat matches', () => {
    const s = { ...createInitialState(), phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
  });
});
