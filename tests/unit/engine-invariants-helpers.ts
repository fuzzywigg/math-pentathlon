/**
 * Seeded PRNG helpers for engine invariant / random-play tests.
 * No fast-check dependency — plain mulberry32 loops.
 *
 * Uses `mulberry32Uint` (forced uint32 state) to preserve historical streams.
 */
export { mulberry32Uint as mulberry32, pick } from '../helpers/rng';

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
