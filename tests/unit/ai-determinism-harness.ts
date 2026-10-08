/**
 * Shared describeHarness for AI determinism / quality audit shards.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import {
  MIDGAME_SAMPLES,
  DIFFICULTIES,
  type AIDifficulty,
  moveKey,
  withOracleRandom,
  collectStates,
  measureQualityAgreement,
  assertQualityDiffers,
} from './ai-determinism-helpers';

export type Harness<T> = {
  label: string;
  /** Build one mid-game state; null if unusable. */
  midgame: (index: number) => T | null;
  /** Pick a move under a fixed seed (determinism path). */
  pickSeeded: (state: T, difficulty: AIDifficulty, seed: number) => unknown;
  /**
   * Hard oracle pick with Math.random glued to 0 (no options.seed).
   * Defaults to pickSeeded under withOracleRandom.
   */
  pickOracle?: (state: T) => unknown;
  /** Optional custom quality check; default uses oracle agreement. */
  quality?: (states: T[]) => void;
};

export function runDeterminism<T>(h: Harness<T>, states: T[]): void {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < states.length; i++) {
      const state = states[i]!;
      const seed = 10_000 + i * 31 + difficulty.length * 97;
      const a = h.pickSeeded(state, difficulty, seed);
      const b = h.pickSeeded(state, difficulty, seed);
      expect(a, `${h.label} ${difficulty} state ${i} null`).not.toBeNull();
      expect(a, `${h.label} ${difficulty} state ${i} undef`).not.toBeUndefined();
      expect(moveKey(a), `${h.label} ${difficulty} state ${i}`).toBe(
        moveKey(b)
      );
    }
  }
}

export function runDefaultQuality<T>(h: Harness<T>, states: T[]): void {
  if (h.quality) {
    h.quality(states);
    return;
  }
  const stats = measureQualityAgreement(
    states,
    (state, difficulty, trialSeed) =>
      h.pickSeeded(state, difficulty, trialSeed),
    (state) =>
      h.pickOracle
        ? h.pickOracle(state)
        : withOracleRandom(() => h.pickSeeded(state, 'hard', 0))
  );
  assertQualityDiffers(stats, h.label);
}

export function describeHarness<T>(h: Harness<T>): void {
  describe(h.label, () => {
    // Share the mid-game fixture across determinism + quality (same 50 states,
    // same asserts — avoids rebuilding the sample twice per game).
    let states: T[] = [];
    beforeAll(() => {
      states = collectStates(MIDGAME_SAMPLES, h.midgame, h.label);
    });
    it(
      `determinism: fixed seed → same move on ${MIDGAME_SAMPLES} mid-game states × difficulties`,
      () => runDeterminism(h, states),
      180_000
    );
    it(
      'quality: easy/medium differ from hard vs oracle',
      () => runDefaultQuality(h, states),
      180_000
    );
  });
}
