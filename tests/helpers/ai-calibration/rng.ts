import { createSeededRng } from '../../../src/core/ai-worker/seeded-rng';

/**
 * Install a mulberry32 seeded Math.random for the duration of `fn`.
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

/** Replace Math.random with a fresh mulberry32 stream (no restore). */
export function installSeededRandom(seed: number): void {
  Math.random = createSeededRng(seed >>> 0);
}

/**
 * Per-ply seed so Easy/Hard consume the same RNG for dice / random opponents
 * at the same decision index (policy differences do not desync later plies).
 */
export function plySeed(gameSeed: number, ply: number): number {
  return (gameSeed + ply * 1009) >>> 0;
}

export function pickRandom<T>(items: T[], rng: () => number = Math.random): T {
  return items[Math.floor(rng() * items.length)];
}
