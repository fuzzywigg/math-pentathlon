/**
 * Shared helpers for undo/redo + move-log property tests (2026-10-07 audit).
 *
 * RNG: `mulberry32Uint` preserves historical uint32-forced streams used by
 * these property tests. Math.random install uses that same stream.
 */
import {
  mulberry32Uint as mulberry32,
  pickIndex,
  pickOne,
} from '../helpers/rng';

export { mulberry32, pickIndex, pickOne };

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}

/** Deep-serialize game state including Map entries (stable key order). */
export function serializeState(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (v instanceof Map) {
      return {
        __map: [...v.entries()].sort(([a], [b]) =>
          String(a).localeCompare(String(b))
        ),
      };
    }
    if (v instanceof Set) {
      return { __set: [...v].sort() };
    }
    return v;
  });
}

/**
 * Install mulberry32Uint as Math.random for a **sync** `fn`, then restore.
 * Same thenable-reject contract as `tests/helpers/rng.ts` `withSeededRandom`
 * (q-mp-1302 / q-mp-1349): async callbacks must not hold the global RNG across
 * an await that races the `finally` restore. Stream stays uint32-forced —
 * do not re-export the canonical helper (different mulberry32 body).
 */
export function withSeededRandom<T>(seed: number, fn: () => T): T {
  const rng = mulberry32(seed);
  const original = Math.random;
  Math.random = rng;
  try {
    const result = fn();
    if (isThenable(result)) {
      throw new TypeError(
        'withSeededRandom does not support async callbacks (thenables); ' +
          'use a sync fn, or seed via createSeededRng / an explicit rng argument'
      );
    }
    return result;
  } finally {
    Math.random = original;
  }
}

/**
 * Property: random legal play → undo N (replay prefix) → earlier state;
 * redo (replay suffix) → final state; history matches applied log entries.
 */
export function assertUndoRedoMoveLog<S, A>(opts: {
  label: string;
  trials?: number;
  /**
   * First trial index (default 0). Pair with `trials` to shard a suite without
   * changing seeds: seed stays `(trial + 1) * 97_531 + 17` for absolute trial.
   */
  trialOffset?: number;
  maxPlies?: number;
  create: (rng: () => number) => S;
  /** Advance one legal ply. Return null when no legal play / terminal. */
  step: (
    state: S,
    rng: () => number
  ) => { state: S; applied: A; logEntry: unknown } | null;
  /** Re-apply a recorded action from a prior state (redo / prefix replay). */
  reapply: (state: S, applied: A) => S;
  getHistory: (state: S) => readonly unknown[];
  /** Compare history entry to the applied action recorded at that ply. */
  historyMatches: (entry: unknown, applied: A) => boolean;
  /** Optional: strip ephemeral UI fields before equality (default: full serialize). */
  fingerprint?: (state: S) => string;
}): void {
  const trials = opts.trials ?? 24;
  const trialOffset = opts.trialOffset ?? 0;
  const maxPlies = opts.maxPlies ?? 16;
  const fingerprint = opts.fingerprint ?? ((s: S) => serializeState(s));

  for (let i = 0; i < trials; i++) {
    const trial = trialOffset + i;
    const seed = (trial + 1) * 97_531 + 17;
    const rng = mulberry32(seed);

    const initial = opts.create(rng);
    const snapshots: S[] = [initial];
    const applied: A[] = [];
    let state = initial;

    for (let ply = 0; ply < maxPlies; ply++) {
      const step = opts.step(state, rng);
      if (!step) break;

      const beforeLen = opts.getHistory(state).length;
      state = step.state;
      const history = opts.getHistory(state);
      if (history.length !== beforeLen + 1) {
        throw new Error(
          `${opts.label} trial ${trial}: history length ${history.length} after ply (expected ${beforeLen + 1})`
        );
      }
      const entry = history[history.length - 1];
      if (!opts.historyMatches(entry, step.applied)) {
        throw new Error(
          `${opts.label} trial ${trial}: history entry mismatch at ply ${ply}`
        );
      }
      applied.push(step.applied);
      snapshots.push(state);
    }

    if (applied.length === 0) continue;

    const nUndo = 1 + pickIndex(rng, applied.length);
    const keep = applied.length - nUndo;

    // Undo N: replay prefix of applied actions from initial
    let undone = initial;
    for (let i = 0; i < keep; i++) {
      undone = opts.reapply(undone, applied[i]!);
    }
    if (fingerprint(undone) !== fingerprint(snapshots[keep]!)) {
      throw new Error(
        `${opts.label} trial ${trial}: undo ${nUndo} did not restore snapshot ${keep}`
      );
    }

    // Redo: re-apply the undone suffix
    let redone = undone;
    for (let i = keep; i < applied.length; i++) {
      redone = opts.reapply(redone, applied[i]!);
    }
    if (fingerprint(redone) !== fingerprint(snapshots[applied.length]!)) {
      throw new Error(
        `${opts.label} trial ${trial}: redo after undo ${nUndo} diverged`
      );
    }

    // Final history equals applied log
    const finalHist = opts.getHistory(snapshots[applied.length]!);
    if (finalHist.length !== applied.length) {
      throw new Error(
        `${opts.label} trial ${trial}: final history length ${finalHist.length} ≠ ${applied.length}`
      );
    }
    for (let i = 0; i < applied.length; i++) {
      if (!opts.historyMatches(finalHist[i], applied[i]!)) {
        throw new Error(
          `${opts.label} trial ${trial}: final history[${i}] mismatch`
        );
      }
    }
  }
}
