/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact startGame / submitAnswer immutability.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 54 frac rules — start/submit do not mutate input', () => {
  it('startGame leaves the original state object unchanged', () => {
    const open = createInitialState('hard');
    const started = startGame(open);
    expect(open.currentProblem).toBeNull();
    expect(open.phase).toBe('playing');
    expect(started).not.toBe(open);
    expect(started.currentProblem).not.toBeNull();
    expect(started.difficulty).toBe('hard');
    expect(started.currentPlayer).toBe('player1');
  });

  it('submitAnswer returns a new object and keeps input phase playing', () => {
    const started = startGame(createInitialState('easy'));
    const next = submitAnswer(started, started.currentProblem!.correctAnswer);
    expect(started.phase).toBe('playing');
    expect(started.problemHistory).toHaveLength(0);
    expect(next).not.toBe(started);
    expect(next.phase).toBe('showingResult');
    expect(next.problemHistory).toHaveLength(1);
  });
});
