/**
 * Shared helpers for AI seed determinism + difficulty quality audit
 * (docs/ai-determinism-2026-10-07.md).
 */
import { createSeededRng } from '../../src/core/ai-worker/seeded-rng';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: readonly AIDifficulty[] = [
  'easy',
  'medium',
  'hard',
] as const;

/** Mid-game sample size required by the audit. */
export const MIDGAME_SAMPLES = 50;

/** Stable move key for equality checks across AI return shapes. */
export function moveKey(move: unknown): string {
  return JSON.stringify(move, (_k, v) => {
    if (v instanceof Map) return { __map: [...v.entries()] };
    if (typeof v === 'number' && !Number.isFinite(v)) {
      return String(v);
    }
    return v;
  });
}

/**
 * Run `fn` with Math.random replaced by mulberry32(seed).
 * Restores the original Math.random afterward.
 */
export function withSeededRandom<T>(seed: number, fn: () => T): T {
  const rng = createSeededRng(seed);
  const original = Math.random;
  Math.random = rng;
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

/**
 * Seeded search options with a virtual clock (for hex / queens / fab).
 * `tick` controls how fast virtual time advances per `now()` call — smaller
 * ticks allow more root moves to be scored before the deadline.
 */
export function cappedSeedOptions(
  seed: number,
  // Tighter default soft budget: still scores multiple candidates, but aborts
  // sooner on Fab-style full enumerations (audit asserts unchanged).
  deadlineMs = 48,
  tick = 2
): { seed: number; deadlineMs: number; now: () => number } {
  let t = 0;
  return {
    seed,
    deadlineMs,
    now: () => {
      t += tick;
      return t;
    },
  };
}

/** Deadline-only options (Math.random / withSeededRandom supplies entropy). */
export function cappedClockOptions(
  deadlineMs = 48,
  tick = 0.1
): { deadlineMs: number; now: () => number } {
  let t = 0;
  return {
    deadlineMs,
    now: () => {
      t += tick;
      return t;
    },
  };
}

/**
 * Oracle RNG that never triggers `rng() < randomness` / teaching branches
 * when randomness ≤ 1 (constant 0). Hex jitter then applies the same delta
 * to every root move, preserving minimax order.
 */
export function withOracleRandom<T>(fn: () => T): T {
  const original = Math.random;
  Math.random = () => 0;
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

/**
 * Collect up to `count` mid-game states via `generate(i)`.
 * Skips nulls; throws if fewer than `count` usable states.
 */
export function collectStates<T>(
  count: number,
  generate: (index: number) => T | null,
  label: string
): T[] {
  const out: T[] = [];
  let i = 0;
  let attempts = 0;
  const maxAttempts = count * 40;
  while (out.length < count && attempts < maxAttempts) {
    const s = generate(i);
    attempts++;
    i++;
    if (s !== null) out.push(s);
  }
  if (out.length < count) {
    throw new Error(
      `${label}: only collected ${out.length}/${count} mid-game states after ${attempts} attempts`
    );
  }
  return out;
}

export type QualityStats = {
  easyAgree: number;
  mediumAgree: number;
  hardAgree: number;
  samples: number;
  easyDistinctFromHard: number;
  mediumDistinctFromHard: number;
};

/**
 * Compare easy/medium/hard picks against an oracle (hard + Math.random=0).
 * Returns agreement counts and how often easy/medium diverge from hard.
 */
export function measureQualityAgreement<TState>(
  states: TState[],
  pick: (state: TState, difficulty: AIDifficulty, trialSeed: number) => unknown,
  oracle: (state: TState) => unknown,
  trialSeedBase = 90_000
): QualityStats {
  let easyAgree = 0;
  let mediumAgree = 0;
  let hardAgree = 0;
  let easyDistinctFromHard = 0;
  let mediumDistinctFromHard = 0;
  let samples = 0;

  for (let i = 0; i < states.length; i++) {
    const state = states[i]!;
    const best = oracle(state);
    if (best === null || best === undefined) continue;
    const bestKey = moveKey(best);
    const trialSeed = trialSeedBase + i * 17;

    const easy = pick(state, 'easy', trialSeed);
    const medium = pick(state, 'medium', trialSeed + 1);
    const hard = pick(state, 'hard', trialSeed + 2);
    if (easy == null || medium == null || hard == null) continue;

    samples++;
    const easyKey = moveKey(easy);
    const mediumKey = moveKey(medium);
    const hardKey = moveKey(hard);
    if (easyKey === bestKey) easyAgree++;
    if (mediumKey === bestKey) mediumAgree++;
    if (hardKey === bestKey) hardAgree++;
    if (easyKey !== hardKey) easyDistinctFromHard++;
    if (mediumKey !== hardKey) mediumDistinctFromHard++;
  }

  return {
    easyAgree,
    mediumAgree,
    hardAgree,
    samples,
    easyDistinctFromHard,
    mediumDistinctFromHard,
  };
}

/**
 * Assert easy/medium differ from hard in measurable quality:
 * hard agrees with the oracle at least as often as easy, and either
 * easy or medium disagrees with hard on a non-trivial fraction of samples.
 */
export function assertQualityDiffers(stats: QualityStats, label: string): void {
  if (stats.samples < 10) {
    throw new Error(
      `${label}: too few quality samples (${stats.samples}); need mid-game positions with AI moves`
    );
  }
  // Hard should match the oracle at least as often as easy (allowing ties).
  if (stats.hardAgree < stats.easyAgree) {
    throw new Error(
      `${label}: hard oracle-agreement (${stats.hardAgree}) < easy (${stats.easyAgree}) over ${stats.samples}`
    );
  }
  // At least one of easy/medium must diverge from hard on ≥10% of samples,
  // or easy must agree with the oracle strictly less often than hard.
  const divergeRate =
    Math.max(stats.easyDistinctFromHard, stats.mediumDistinctFromHard) /
    stats.samples;
  const easyWorse = stats.easyAgree < stats.hardAgree;
  if (!easyWorse && divergeRate < 0.1) {
    throw new Error(
      `${label}: easy/medium do not measurably differ from hard ` +
        `(easyAgree=${stats.easyAgree}, mediumAgree=${stats.mediumAgree}, ` +
        `hardAgree=${stats.hardAgree}, divergeRate=${divergeRate.toFixed(3)}, n=${stats.samples})`
    );
  }
}
