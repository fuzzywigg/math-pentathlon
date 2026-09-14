/** Wave 42 — Pinball correct answer points with seeded hitRandomTarget. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  TARGET_POINTS,
} from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  hitRandomTarget,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Pinball — correct points seeded', () => {
  it('Math.random 0 hits the lowest TARGET_POINTS value', () => {
    const targets = createInitialState().targets;
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { points, target } = hitRandomTarget(targets);
    expect(points).toBe(TARGET_POINTS[0]);
    expect(target.value).toBe(TARGET_POINTS[0]);
  });

  it('correct submit adds seeded target points to score', () => {
    let state = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const before = state.player1Stats.score;
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    expect(state.isCorrect).toBe(true);
    expect(state.player1Stats.score).toBe(before + TARGET_POINTS[0]);
    expect(state.player1Stats.correctAnswers).toBe(1);
  });

  it('seeded high random can select a higher-value target', () => {
    const targets = createInitialState().targets;
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const { points } = hitRandomTarget(targets);
    expect(TARGET_POINTS).toContain(points);
    expect(points).toBeGreaterThanOrEqual(TARGET_POINTS[0]);
  });

  it('correctAnswers increments once per correct submit under seed', () => {
    let state = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    expect(state.player1Stats.correctAnswers).toBe(1);
    expect(state.phase).toBe('showResult');
  });
});
