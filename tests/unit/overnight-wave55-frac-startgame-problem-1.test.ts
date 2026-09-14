/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact startGame problem-1 id.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac rules — startGame problem-1', () => {
  it('ids the first problem as problem-1', () => {
    const started = startGame(createInitialState('hard'));
    expect(started.currentProblem?.id).toBe('problem-1');
    expect(started.phase).toBe('playing');
    expect(started.currentProblem?.answerChoices.length).toBe(4);
  });
});
