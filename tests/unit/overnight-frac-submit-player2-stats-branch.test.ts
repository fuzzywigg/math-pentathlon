/**
 * Overnight TOKENMAXX — Frac-Fact p2 submit stats leftover. Tests-only.
 * Forges generateProblem without Math.random spy (constant RNG OOMs distractors).
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Overnight frac-fact — p2 submit', () => {
  it('correct submit bumps only player2Stats', () => {
    const problem = generateProblem('medium', 1);
    const s = {
      ...createInitialState('medium'),
      currentPlayer: 'player2' as const,
      currentProblem: problem,
      phase: 'playing' as const,
    };
    const next = submitAnswer(s, problem.correctAnswer);
    expect(next.player2Stats.correctAnswers).toBe(1);
    expect(next.player2Stats.score).toBeGreaterThan(0);
    expect(next.player1Stats.correctAnswers).toBe(0);
    expect(next.problemHistory[0].player).toBe('player2');
  });
});
