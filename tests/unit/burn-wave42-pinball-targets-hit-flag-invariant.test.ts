/** Wave 42 — Pinball targets hit flag remains false after scoring. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  hitRandomTarget,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Pinball — targets hit flag invariant', () => {
  it('createInitialState targets all start with hit false', () => {
    const state = createInitialState();
    expect(state.targets.length).toBeGreaterThan(0);
    for (const t of state.targets) {
      expect(t.hit).toBe(false);
    }
  });

  it('hitRandomTarget does not flip hit flags on source array', () => {
    const targets = createInitialState().targets;
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    hitRandomTarget(targets);
    expect(targets.every((t) => t.hit === false)).toBe(true);
  });

  it('correct submit leaves all target.hit false', () => {
    let state = startGame(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0);
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    expect(state.isCorrect).toBe(true);
    expect(state.targets.every((t) => t.hit === false)).toBe(true);
  });

  it('wrong submit also leaves hit flags untouched', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, '__wrong__');
    expect(state.isCorrect).toBe(false);
    expect(state.targets.every((t) => t.hit === false)).toBe(true);
  });

  it('target ids and values stay stable after scoring', () => {
    let state = startGame(createInitialState());
    const snapshot = state.targets.map((t) => ({ ...t }));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    expect(state.targets).toEqual(snapshot);
  });
});
