/**
 * Game-group partitions for engine-property-invariants shards (q-mp-1351).
 * Wall-balanced from tip remasure; every registered id appears in exactly one group.
 * Does not touch playout / fingerprint / immutability helpers (HOLD-CHECK 1309).
 */
import {
  ALL_GAME_ADAPTERS,
  type GameFuzzAdapter,
} from './state-roundtrip-games';

/** Heaviest playouts (+ pent/queens validators). */
export const ENGINE_PROPERTY_HEAVY_IDS = [
  'fab-a-diffy',
  'fiar',
  'pent-em-in',
  'queens-guards',
  'ramrod',
] as const;

/** Mid-cost board / dice engines (+ their secondary validators). */
export const ENGINE_PROPERTY_MID_IDS = [
  'contig-60',
  'juggle',
  'kwatro-sinko',
  'par-55',
  'prime-gold',
  'stars-bars',
  'sum-dominoes',
] as const;

/** Light engines + hex strict-alternation (+ hex / hex-a-gone validators). */
export const ENGINE_PROPERTY_LIGHT_IDS = [
  'calla',
  'frac-fact',
  'fraction-pinball',
  'hex',
  'hex-a-gone',
  'kings-quadraphages',
  'remainder-islands',
  'star-track',
] as const;

export const ENGINE_PROPERTY_ALL_GROUP_IDS = [
  ...ENGINE_PROPERTY_HEAVY_IDS,
  ...ENGINE_PROPERTY_MID_IDS,
  ...ENGINE_PROPERTY_LIGHT_IDS,
] as const;

/** Adapters in registry order restricted to the given id set. */
export function adaptersByIds(ids: readonly string[]): GameFuzzAdapter[] {
  const set = new Set<string>(ids);
  return ALL_GAME_ADAPTERS.filter((a) => set.has(a.id));
}
