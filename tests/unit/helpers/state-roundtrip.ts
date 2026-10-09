/**
 * Shared helpers for game-state serialize/deserialize fuzz tests.
 *
 * On-device progress (`src/core/storage`) stores stats only — not mid-game boards.
 * Mid-game transfer in-app uses structuredClone (AI workers). Kings is the only
 * game with a dedicated JSON save codec. These helpers cover both paths:
 * - `jsonRoundTrip`: Map/Set-aware JSON (localStorage-shaped mid-game save)
 * - `structuredRoundTrip`: structuredClone (worker / in-memory snapshot)
 */

import {
  createSeededRng,
  withSeededMathRandom,
} from '../../helpers/rng';

const MAP_TAG = '__mp_map__';
const SET_TAG = '__mp_set__';

export function createRng(seed: number): () => number {
  return createSeededRng(seed);
}

/** Lenient: empty length returns 0 (roundtrip fuzz never throws here). */
export function pickIndex(rng: () => number, length: number): number {
  if (length <= 0) return 0;
  return Math.floor(rng() * length);
}

export function pickOne<T>(rng: () => number, items: T[]): T {
  return items[pickIndex(rng, items.length)] as T;
}

/** Temporarily replace Math.random; always restore in finally. */
export { withSeededMathRandom };

function isTagged(
  value: unknown,
  tag: string
): value is { [k: string]: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { [k: string]: unknown })[tag] === true
  );
}

/** JSON replacer that encodes Map / Set for localStorage-shaped saves. */
function jsonReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return { [MAP_TAG]: true, entries: Array.from(value.entries()) };
  }
  if (value instanceof Set) {
    return { [SET_TAG]: true, values: Array.from(value.values()) };
  }
  return value;
}

/** JSON reviver that restores Map / Set from tagged plain objects. */
function jsonReviver(_key: string, value: unknown): unknown {
  if (isTagged(value, MAP_TAG) && Array.isArray(value.entries)) {
    return new Map(value.entries as [unknown, unknown][]);
  }
  if (isTagged(value, SET_TAG) && Array.isArray(value.values)) {
    return new Set(value.values as unknown[]);
  }
  return value;
}

/** Serialize → parse with Map/Set revive (on-device JSON stand-in). */
export function jsonRoundTrip<T>(state: T): T {
  return JSON.parse(JSON.stringify(state, jsonReplacer), jsonReviver) as T;
}

/** structuredClone round-trip (AI worker / in-memory snapshot path). */
export function structuredRoundTrip<T>(state: T): T {
  return structuredClone(state);
}

/** Canonical JSON for comparing legal-move lists (order-independent). */
export function canonMoves(moves: unknown[]): string {
  return JSON.stringify(
    moves
      .map((m) => JSON.parse(JSON.stringify(m, jsonReplacer)))
      .sort((a, b) => {
        const sa = JSON.stringify(a);
        const sb = JSON.stringify(b);
        return sa < sb ? -1 : sa > sb ? 1 : 0;
      })
  );
}

/** Strip lazy caches that are not part of persisted game identity. */
export function stripLazyCaches<T extends object>(state: T): T {
  const cloned = structuredClone(state) as T & {
    board?: { straightLinesCache?: unknown };
  };
  if (cloned.board && 'straightLinesCache' in cloned.board) {
    delete cloned.board.straightLinesCache;
  }
  return cloned;
}

export const AI_COMPARE_SEED = 42;
export const DEFAULT_MAX_MOVES = 28;
/** Cap for Kwatro / FIAR — movement phases can loop for a very long time. */
export const LOOP_PRONE_MAX_MOVES = 18;
export const FUZZ_PLAY_SEED = 20261007;
