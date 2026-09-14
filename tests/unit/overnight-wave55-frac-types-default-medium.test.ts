/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact createInitialState default medium.
 * Wave52 covered explicit easy/hard. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Wave 55 frac types — default medium', () => {
  it('defaults difficulty medium with empty history', () => {
    const s = createInitialState();
    expect(s.difficulty).toBe('medium');
    expect(s.currentPlayer).toBe('player1');
    expect(s.problemHistory).toEqual([]);
    expect(s.winner).toBeNull();
    expect(s.currentProblem).toBeNull();
  });
});
