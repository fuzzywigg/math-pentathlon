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

function runDeterminism<T>(h: Harness<T>, states: T[]): void {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < states.length; i++) {
      const state = states[i]!;
      const seed = 10_000 + i * 31 + difficulty.length * 97;
      const a = h.pickSeeded(state, difficulty, seed);
      const b = h.pickSeeded(state, difficulty, seed);
      expect(a, `${h.label} ${difficulty} state ${i} null`).not.toBeNull();
      expect(
        a,
        `${h.label} ${difficulty} state ${i} undef`
      ).not.toBeUndefined();
      expect(moveKey(a), `${h.label} ${difficulty} state ${i}`).toBe(
        moveKey(b)
      );
    }
  }
}

function runDefaultQuality<T>(h: Harness<T>, states: T[]): void {
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

/**
 * Case timeout for determinism/quality. CI GHA hosts sit near 130–160s for
 * queens-guards determinism under peer-shard load (q-mp-151); 180s was thin.
 * Local stays at 180s; CI gets 300s headroom. Harness-only — no AI budgets.
 */
const CASE_TIMEOUT_MS = process.env.CI ? 300_000 : 180_000;

/** Hook timeout for mid-game fixture collect under CI thread contention. */
const HOOK_TIMEOUT_MS = process.env.CI ? 120_000 : 30_000;

export function describeHarness<T>(h: Harness<T>): void {
  describe(h.label, () => {
    // Share the mid-game fixture across determinism + quality (same 50 states,
    // same asserts — avoids rebuilding the sample twice per game).
    let states: T[] = [];
    beforeAll(() => {
      states = collectStates(MIDGAME_SAMPLES, h.midgame, h.label);
    }, HOOK_TIMEOUT_MS);
    it(
      `determinism: fixed seed → same move on ${MIDGAME_SAMPLES} mid-game states × difficulties`,
      () => runDeterminism(h, states),
      CASE_TIMEOUT_MS
    );
    it(
      'quality: easy/medium differ from hard vs oracle',
      () => runDefaultQuality(h, states),
      CASE_TIMEOUT_MS
    );
  });
}
