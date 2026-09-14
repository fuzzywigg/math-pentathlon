/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact nextProblem mid-game player switch.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, nextProblem } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac rules — next mid-game switch', () => {
  it('switches to player2 and ids problem-2', () => {
    const started = startGame(createInitialState('medium'));
    const next = nextProblem(started);
    expect(next.phase).toBe('playing');
    expect(next.currentPlayer).toBe('player2');
    expect(next.problemsCompleted).toBe(1);
    expect(next.currentProblem?.id).toBe('problem-2');
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
  });
});
