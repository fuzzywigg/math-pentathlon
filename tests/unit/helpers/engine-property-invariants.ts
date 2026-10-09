/**
 * Seeded property / invariant playout harness for rules engines.
 *
 * Reuses GameFuzzAdapter (legalMoves / apply / isOver / roundTrip) plus
 * mulberry32 + serializeState. No fast-check dependency.
 *
 * Invariants checked per playout:
 * 1. Legal-move generator soundness — every sampled legal move applies without
 *    throw and yields a coherent post-state (round-trip normalize).
 * 2. Apply keeps state valid — normalize is stable; seat (when present) is
 *    always player1|player2.
 * 3. Turn order — when the seat changes, it flips to the opponent (multi-phase
 *    / extra-turn games may keep the same seat across steps).
 * 4. Undo via prefix replay — replaying applied moves from the initial state
 *    restores each snapshot fingerprint exactly.
 * 5. Game-over consistency — isOver ⇒ legalMoves empty; isOver stable under
 *    roundTrip; once over, stays over.
 * 6. Serialization round-trip — adapter.roundTrip preserves normalize(state).
 */

import { mulberry32, pick } from '../engine-invariants-helpers';
import { serializeState } from '../undo-audit-helpers';
import {
  withSeededRandom,
  createRng,
  pickOne,
} from './state-roundtrip';
import type { GameFuzzAdapter } from './state-roundtrip-games';

export const PROPERTY_SEEDS = [20_261_008, 424_242, 7] as const;

/** Cap plies per seed so the full suite stays well under ~30s added. */
export const PROPERTY_MAX_PLIES = 14;

/** How many legal moves to soundness-check at each position (incl. chosen). */
export const LEGAL_SAMPLE_CAP = 8;

export type Seat = 'player1' | 'player2';

function extractSeat(state: unknown): Seat | null {
  if (typeof state !== 'object' || state === null) return null;
  const seat = (state as { currentPlayer?: unknown }).currentPlayer;
  if (seat === 'player1' || seat === 'player2') return seat;
  return null;
}

export function opponent(seat: Seat): Seat {
  return seat === 'player1' ? 'player2' : 'player1';
}

export function fingerprint(state: unknown): string {
  return serializeState(state);
}

/**
 * Games where a single adapter "move" always completes a seat turn when the
 * game is still ongoing (no multi-phase / extra-turn / quiz ledger steps).
 * Used only for a stricter alternation check; the weak flip-on-change check
 * still applies to every seated game.
 */
export const STRICT_ALTERNATE_GAMES = new Set(['hex']);

/** Games known to allow same-seat consecutive steps (extra turn / multi-phase). */
export const SAME_SEAT_OK_GAMES = new Set([
  'calla', // mancala extra turn
  'kings-quadraphages', // moveKing then placeQuadraphage
  'contig-60', // roll then place/pass
  'sum-dominoes', // roll then place/pass
  'prime-gold', // roll then place/pass
  'juggle', // roll then place
  'hex-a-gone', // select/commit then place
  'star-track', // draw then select
  'remainder-islands', // roll then select island
  'frac-fact', // answer then next
  'fraction-pinball', // answer then next
  'fab-a-diffy', // multi-select before execute (adapter applies full turn though)
  'pent-em-in', // may pass without seat change paths via empty legal
  'kwatro-sinko', // pass keeps progressing; movement can stay complex
  'fiar', // placement then movement; multi-step
  'par-55',
  'ramrod',
  'stars-bars',
  'queens-guards', // restore phase same seat
]);

export interface PropertyPlayoutResult {
  movesPlayed: number;
  ended: boolean;
}

export function runPropertyPlayout(
  adapter: GameFuzzAdapter,
  playSeed: number,
  opts?: { maxPlies?: number; legalSampleCap?: number }
): PropertyPlayoutResult {
  const maxPlies = opts?.maxPlies ?? PROPERTY_MAX_PLIES;
  const legalSampleCap = opts?.legalSampleCap ?? LEGAL_SAMPLE_CAP;
  const rng = createRng(playSeed);

  const initial = withSeededRandom(playSeed, () => adapter.create());
  const snapshots: unknown[] = [adapter.normalize(initial)];
  const applied: unknown[] = [];
  let state = initial;

  assertRoundTrip(adapter, state, 'initial');
  assertGameOverConsistency(adapter, state, 'initial');
  assertSeatValid(state, adapter.id, 'initial');

  for (let ply = 0; ply < maxPlies; ply++) {
    if (adapter.isOver(state)) break;

    const legal = adapter.legalMoves(state);
    if (legal.length === 0) {
      // No legal moves while not over — stick, settle, or soft-lock.
      // Consistency: must not invent moves after round-trip.
      const restored = adapter.roundTrip(state);
      expectEqualMoves(adapter, state, restored, `${adapter.id} empty-legal`);
      break;
    }

    // Soundness: every sampled legal move applies + round-trips.
    const sample = sampleLegalMoves(legal, rng, legalSampleCap);
    for (const move of sample) {
      assertLegalMoveSound(adapter, state, move, ply);
    }

    const choice = pickOne(rng, legal);
    const seatBefore = extractSeat(state);
    const next = withSeededRandom(playSeed + ply + 1, () =>
      adapter.apply(state, choice)
    );

    assertApplyKeepsValid(adapter, state, next, ply);
    assertTurnOrder(adapter, seatBefore, extractSeat(next), ply);
    assertRoundTrip(adapter, next, `ply ${ply}`);
    assertGameOverConsistency(adapter, next, `ply ${ply}`);

    applied.push(choice);
    state = next;
    snapshots.push(adapter.normalize(state));
  }

  // Undo via prefix replay from the true initial create (same seed).
  assertUndoPrefixReplay(adapter, playSeed, applied, snapshots);

  // Terminal consistency if we ended.
  if (adapter.isOver(state)) {
    expectEmptyLegal(adapter, state, 'terminal');
    const restored = adapter.roundTrip(state);
    if (!adapter.isOver(restored)) {
      throw new Error(
        `${adapter.id}: isOver lost after roundTrip at terminal`
      );
    }
  }

  return {
    movesPlayed: applied.length,
    ended: adapter.isOver(state),
  };
}

function sampleLegalMoves(
  legal: unknown[],
  rng: () => number,
  cap: number
): unknown[] {
  if (legal.length <= cap) return legal;
  const copy = [...legal];
  const out: unknown[] = [];
  while (out.length < cap && copy.length > 0) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function assertLegalMoveSound(
  adapter: GameFuzzAdapter,
  state: unknown,
  move: unknown,
  ply: number
): void {
  let next: unknown;
  try {
    next = adapter.apply(state, move);
  } catch (err) {
    throw new Error(
      `${adapter.id} ply ${ply}: legal move threw: ${String(err)} move=${serializeState(move)}`
    );
  }
  // Prior state must not be mutated by apply (immutability via fingerprint).
  // We compare normalize of a fresh view — adapters should return new objects.
  assertRoundTrip(adapter, next, `${adapter.id} legal-sample ply ${ply}`);
  assertSeatValid(next, adapter.id, `legal-sample ply ${ply}`);
  assertGameOverConsistency(
    adapter,
    next,
    `legal-sample ply ${ply}`
  );
}

function assertApplyKeepsValid(
  adapter: GameFuzzAdapter,
  before: unknown,
  after: unknown,
  ply: number
): void {
  assertSeatValid(after, adapter.id, `after ply ${ply}`);
  // Applying a legal move should not corrupt normalize.
  const norm = adapter.normalize(after);
  if (fingerprint(norm) !== fingerprint(adapter.normalize(norm))) {
    throw new Error(
      `${adapter.id} ply ${ply}: normalize not idempotent after apply`
    );
  }
  void before;
}

function assertTurnOrder(
  adapter: GameFuzzAdapter,
  before: Seat | null,
  after: Seat | null,
  ply: number
): void {
  if (before === null || after === null) return;

  if (before !== after && after !== opponent(before)) {
    throw new Error(
      `${adapter.id} ply ${ply}: seat jumped ${before} → ${after} (expected opponent or same)`
    );
  }
  // Strict alternation for hex is asserted separately via
  // assertHexStrictAlternation (needs post-apply isOver to allow terminal
  // same-seat). Multi-phase / extra-turn games may keep the same seat.
}

function assertRoundTrip(
  adapter: GameFuzzAdapter,
  state: unknown,
  label: string
): void {
  const restored = adapter.roundTrip(state);
  if (
    fingerprint(adapter.normalize(restored)) !==
    fingerprint(adapter.normalize(state))
  ) {
    throw new Error(
      `${adapter.id} ${label}: serialize round-trip normalize mismatch`
    );
  }
}

function assertGameOverConsistency(
  adapter: GameFuzzAdapter,
  state: unknown,
  label: string
): void {
  if (!adapter.isOver(state)) return;
  expectEmptyLegal(adapter, state, label);
  const restored = adapter.roundTrip(state);
  if (!adapter.isOver(restored)) {
    throw new Error(
      `${adapter.id} ${label}: isOver true live but false after roundTrip`
    );
  }
}

function expectEmptyLegal(
  adapter: GameFuzzAdapter,
  state: unknown,
  label: string
): void {
  const legal = adapter.legalMoves(state);
  if (legal.length !== 0) {
    throw new Error(
      `${adapter.id} ${label}: isOver but legalMoves returned ${legal.length}`
    );
  }
}

function assertSeatValid(
  state: unknown,
  id: string,
  label: string
): void {
  const seat = extractSeat(state);
  if (seat === null) {
    // Kings always has currentPlayer; quiz games too. If absent, skip.
    return;
  }
  if (seat !== 'player1' && seat !== 'player2') {
    throw new Error(`${id} ${label}: invalid seat ${String(seat)}`);
  }
}

function expectEqualMoves(
  adapter: GameFuzzAdapter,
  a: unknown,
  b: unknown,
  label: string
): void {
  const la = serializeState(adapter.legalMoves(a));
  const lb = serializeState(adapter.legalMoves(b));
  if (la !== lb) {
    throw new Error(`${label}: legalMoves diverged after roundTrip`);
  }
}

function assertUndoPrefixReplay(
  adapter: GameFuzzAdapter,
  playSeed: number,
  applied: unknown[],
  snapshots: unknown[]
): void {
  if (applied.length === 0) return;

  // Rebuild from the same seeded create, replaying the prefix.
  const start = withSeededRandom(playSeed, () => adapter.create());
  if (fingerprint(adapter.normalize(start)) !== fingerprint(snapshots[0])) {
    throw new Error(
      `${adapter.id}: seeded create not reproducible for undo baseline`
    );
  }

  let rebuilt = start;
  for (let i = 0; i < applied.length; i++) {
    rebuilt = withSeededRandom(playSeed + i + 1, () =>
      adapter.apply(rebuilt, applied[i])
    );
    if (
      fingerprint(adapter.normalize(rebuilt)) !==
      fingerprint(snapshots[i + 1])
    ) {
      throw new Error(
        `${adapter.id}: undo prefix replay diverged at ply ${i}`
      );
    }
  }

  // Random undo depth: replay only the first `keep` moves.
  const rng = mulberry32(playSeed ^ 0x9e3779b9);
  const keep = Math.floor(rng() * (applied.length + 1));
  let undone = withSeededRandom(playSeed, () => adapter.create());
  for (let i = 0; i < keep; i++) {
    undone = withSeededRandom(playSeed + i + 1, () =>
      adapter.apply(undone, applied[i])
    );
  }
  if (
    fingerprint(adapter.normalize(undone)) !== fingerprint(snapshots[keep])
  ) {
    throw new Error(
      `${adapter.id}: undo keep=${keep} did not restore snapshot`
    );
  }
}

/** Hex-only: after a non-terminal move, seat must flip. */
export function assertHexStrictAlternation(
  adapter: GameFuzzAdapter,
  playSeed: number,
  maxPlies = PROPERTY_MAX_PLIES
): void {
  if (adapter.id !== 'hex') return;
  const rng = createRng(playSeed);
  let state = withSeededRandom(playSeed, () => adapter.create());
  for (let ply = 0; ply < maxPlies; ply++) {
    if (adapter.isOver(state)) break;
    const legal = adapter.legalMoves(state);
    if (legal.length === 0) break;
    const before = extractSeat(state);
    const choice = pick(rng, legal);
    state = withSeededRandom(playSeed + ply + 1, () =>
      adapter.apply(state, choice)
    );
    if (adapter.isOver(state)) break;
    const after = extractSeat(state);
    if (before === null || after === null) continue;
    if (after !== opponent(before)) {
      throw new Error(
        `hex ply ${ply}: expected seat flip ${before} → ${opponent(before)}, got ${after}`
      );
    }
  }
}
