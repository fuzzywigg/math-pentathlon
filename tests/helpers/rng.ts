/**
 * Shared seeded RNG helpers for unit + e2e test suites.
 *
 * Canonical stream: `createSeededRng` from `src/core/ai-worker/seeded-rng.ts`
 * (mulberry32 with `t += 0x6d2b79f5`). Prefer these helpers over local copies.
 *
 * `mulberry32Uint` keeps the uint32-forced variant historically used by
 * engine-invariants / undo-audit property tests — do not mix the two streams
 * inside a single fixture unless you intentionally re-seed.
 */
import { createSeededRng } from '../../src/core/ai-worker/seeded-rng';

export { createSeededRng };

/** Alias matching historical test helper names (`engine-invariants-helpers`). */
export function mulberry32(seed: number): () => number {
  return createSeededRng(seed);
}

/**
 * Mulberry32 with forced uint32 state each step.
 * Matches the historical `engine-invariants-helpers` / `undo-audit-helpers` body.
 */
export function mulberry32Uint(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Replace Math.random with a fresh seeded stream (no restore). */
export function installSeededRandom(seed: number): void {
  Math.random = createSeededRng(seed >>> 0);
}

/**
 * Install a seeded Math.random for the duration of `fn`.
 * Restores the previous Math.random afterward.
 */
export function withSeededRandom<T>(seed: number, fn: () => T): T {
  const previous = Math.random;
  installSeededRandom(seed);
  try {
    return fn();
  } finally {
    Math.random = previous;
  }
}

/** Alias used by state-roundtrip helpers. */
export const withSeededMathRandom = withSeededRandom;

/**
 * Per-ply seed so Easy/Hard consume the same RNG for dice / random opponents
 * at the same decision index (policy differences do not desync later plies).
 */
export function plySeed(gameSeed: number, ply: number): number {
  return (gameSeed + ply * 1009) >>> 0;
}

export function pickIndex(rng: () => number, length: number): number {
  if (length <= 0) {
    throw new Error('pickIndex: empty length');
  }
  return Math.floor(rng() * length);
}

export function pickOne<T>(rng: () => number, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('pickOne: empty list');
  }
  return items[pickIndex(rng, items.length)] as T;
}

/** Pick with optional rng (defaults to Math.random). */
export function pickRandom<T>(
  items: readonly T[],
  rng: () => number = Math.random
): T {
  return pickOne(rng, items);
}

/** Historical `pick(rng, items)` argument order from engine-invariants-helpers. */
export function pick<T>(rng: () => number, items: readonly T[]): T {
  return pickOne(rng, items);
}

/**
 * Self-contained browser callback for Playwright `page.addInitScript`.
 * Must not close over module scope — Playwright serializes the function body.
 * Same algorithm as `createSeededRng`.
 */
export function browserInstallSeededRandom(seed: number): void {
  let t = seed >>> 0;
  Math.random = () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
