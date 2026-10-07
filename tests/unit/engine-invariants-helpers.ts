/**
 * Seeded PRNG helpers for engine invariant / random-play tests.
 * No fast-check dependency — plain mulberry32 loops.
 */

/** Mulberry32 — deterministic uint32 → [0, 1). */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a uniform random element; throws if empty. */
export function pick<T>(rng: () => number, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('pick: empty list');
  }
  return items[Math.floor(rng() * items.length)]!;
}

/** Deep-ish structural snapshot for immutability checks (Maps → entries). */
export function snapshotJson(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (v instanceof Map) {
      return { __map: [...v.entries()] };
    }
    if (v instanceof Set) {
      return { __set: [...v.values()] };
    }
    return v;
  });
}
