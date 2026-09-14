/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact submit history player1.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 56 frac rules — history player1', () => {
  it('correct p1 submit records player1 in history leftover', () => {
    const problem = generateProblem('easy', 1);
    const next = submitAnswer(
      {
        ...createInitialState('easy'),
        phase: 'playing',
        currentProblem: problem,
        currentPlayer: 'player1',
      },
      problem.correctAnswer
    );
    expect(next.problemHistory[0]?.player).toBe('player1');
    expect(next.problemHistory[0]?.timeSpent).toBe(0);
  });
});
