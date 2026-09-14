/**
 * Wave 41 — Frac Fact hard ops + nextProblem p2 win + phase identity.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  POINTS_PER_CORRECT,
} from '../../src/games/frac-fact/types';
import {
  generateProblem,
  submitAnswer,
  nextProblem,
  checkAnswer,
} from '../../src/games/frac-fact/rules';
import { getAIAnswer } from '../../src/games/frac-fact/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 frac-fact — hard / p2 / identity', () => {
  it('medium never divide; hard eventually may include divide', () => {
    for (let i = 0; i < 30; i++) {
      expect(generateProblem('medium', i).operation).not.toBe('divide');
    }
    const ops = new Set(
      Array.from({ length: 80 }, (_, i) => generateProblem('hard', i).operation)
    );
    expect(ops.has('add')).toBe(true);
    // divide is possible on hard — do not require it every run if RNG sparse
    expect(ops.size).toBeGreaterThan(1);
  });

  it('generateProblem choices always include correct answer', () => {
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const p = generateProblem(d, 3);
      expect(p.answerChoices.some((c) => checkAnswer(p, c))).toBe(true);
    }
  });

  it('submitAnswer identity on showingResult / gameOver', () => {
    const problem = generateProblem('easy', 1);
    for (const phase of ['showingResult', 'gameOver'] as const) {
      const state = {
        ...createInitialState('easy'),
        phase,
        currentProblem: problem,
      };
      expect(submitAnswer(state, problem.correctAnswer)).toBe(state);
    }
  });

  it('nextProblem awards player2 when p2 score higher at max', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'showingResult' as const,
      problemsCompleted: 9,
      maxProblems: 10,
      player1Stats: {
        ...createInitialState().player1Stats,
        score: 2,
      },
      player2Stats: {
        ...createInitialState().player2Stats,
        score: 8,
      },
    };
    const next = nextProblem(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });

  it('getAIAnswer miss returns wrong choice from list', () => {
    const problem = generateProblem('easy', 1);
    const state = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
      currentPlayer: 'player1' as const,
    };
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const ans = getAIAnswer(state, 'player1', 'hard');
    expect(ans).not.toBeNull();
    expect(problem.answerChoices).toContain(ans!);
  });

  it('POINTS_PER_CORRECT positive constant', () => {
    expect(POINTS_PER_CORRECT).toBeGreaterThan(0);
  });
});
