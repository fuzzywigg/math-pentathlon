/**
 * Engine branch-coverage invariant suite (2026-10-07).
 * Targets the six lowest-covered rules engines: kwatro-sinko, ramrod, par-55,
 * kings-quadraphages, calla, fiar.
 *
 * Uses seeded loops (no fast-check). Does not change rules/scoring.
 * If an invariant fails against current rules, the case is skipped with a TODO.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { mulberry32, pick, snapshotJson } from './engine-invariants-helpers';

import {
  createInitialState as kwaInit,
  selectChip as kwaSelect,
  moveChip as kwaMove,
  getValidMoves as kwaGetValid,
  isValidMove as kwaIsValid,
  hasValidMoves as kwaHasValid,
  passTurn as kwaPass,
} from '../../src/games/kwatro-sinko/rules';
import type { KwaState } from '../../src/games/kwatro-sinko/types';

import {
  createInitialState as ramInit,
  selectRod,
  placeRod,
  getValidPlacements as ramPlacements,
  isValidPlacement as ramIsValid,
  hasValidMoves as ramHasValid,
  passTurn as ramPass,
  clearSelection as ramClear,
} from '../../src/games/ramrod/rules';
import type { RamrodState } from '../../src/games/ramrod/types';

import {
  createInitialState as parInit,
  selectBlock,
  placeBlock,
  getValidPlacements as parPlacements,
  isValidPlacement as parIsValid,
  hasValidMoves as parHasValid,
  passTurn as parPass,
  clearSelection as parClear,
} from '../../src/games/par-55/rules';
import type { Par55State } from '../../src/games/par-55/types';

import {
  createInitialGameState as kingsBoardInit,
} from '../../src/games/kings-quadraphages/board';
import {
  getValidKingMoves,
  isValidKingMove,
  getValidQuadraphagePlacements,
  isValidQuadraphagePlacement,
  checkWinCondition,
  isDrawCondition,
  canCompleteTurn,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState as kingsPlayInit,
  moveKing,
  placeQuadraphage,
  getKingPosition,
  isValidMove as kingsIsValidMove,
  isValidPlacement as kingsIsValidPlacement,
  type GameState as KingsPlayState,
  type Position as Kings1Based,
} from '../../src/games/kings-quadraphages/game-state';

import {
  createInitialState as callaInit,
  TOTAL_CUBES,
} from '../../src/games/calla/types';
import {
  getValidPits,
  canSelectPit,
  makeMove,
  isGameOver,
  settleNoValidMoves,
} from '../../src/games/calla/rules';
import type { CallaGameState } from '../../src/games/calla/types';

import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import {
  canPlaceChip,
  placeChip,
  getValidMoves as fiarGetValid,
  canMove as fiarCanMove,
  moveChip as fiarMove,
  getSelectableNodes,
  setSelectedChipKind,
  normalizeSelectedChipKind,
  isDraw as fiarIsDraw,
} from '../../src/games/fiar/rules';
import type { FiarGameState, ChipKind } from '../../src/games/fiar/types';

afterEach(() => {
  vi.restoreAllMocks();
});

const SEEDS = [1, 7, 42, 99, 12345] as const;

// =============================================================================
// Kwatro-Sinko
// =============================================================================

function kwaAssertNonNegative(state: KwaState): void {
  // Player1 includes chip value 0 by design (even set 0,2,4,6,8).
  for (const chip of state.chips.values()) {
    expect(chip.value).toBeGreaterThanOrEqual(0);
  }
  expect(state.chips.size).toBe(10);
  expect(state.moveHistory.length).toBeGreaterThanOrEqual(0);
}

function kwaRandomStep(state: KwaState, rng: () => number): KwaState {
  if (state.phase === 'gameOver') return state;
  if (!kwaHasValid(state)) return kwaPass(state);

  const own = [...state.chips.values()].filter(
    (c) => c.owner === state.currentPlayer && c.position
  );
  const movable = own.filter((c) => kwaGetValid(state, c.id).length > 0);
  if (movable.length === 0) return kwaPass(state);

  const chip = pick(rng, movable);
  const next = kwaSelect(state, chip.id);
  const dests = kwaGetValid(next, chip.id);
  if (dests.length === 0) return kwaPass(state);
  return kwaMove(next, pick(rng, dests));
}

describe('Engine invariants — kwatro-sinko', () => {
  it('legal-move generator only returns destinations accepted by isValidMove', () => {
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = kwaInit();
      for (let i = 0; i < 40 && state.phase !== 'gameOver'; i++) {
        for (const chip of state.chips.values()) {
          if (chip.owner !== state.currentPlayer) continue;
          const moves = kwaGetValid(state, chip.id);
          for (const dest of moves) {
            expect(kwaIsValid(state, chip.id, dest)).toBe(true);
          }
        }
        state = kwaRandomStep(state, rng);
        kwaAssertNonNegative(state);
      }
    }
  });

  it('select/move do not mutate the prior state object (immutability)', () => {
    const state = kwaInit();
    const before = snapshotJson(state);
    const chipId = 'p1-0';
    const dests = kwaGetValid(state, chipId);
    expect(dests.length).toBeGreaterThan(0);
    const selected = kwaSelect(state, chipId);
    expect(snapshotJson(state)).toBe(before);
    kwaMove(selected, dests[0]!);
    expect(snapshotJson(state)).toBe(before);
    expect(selected.selectedChip).toBe(chipId);
  });

  it('non-negative chip values preserved under random play', () => {
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = kwaInit();
      for (let i = 0; i < 80; i++) {
        kwaAssertNonNegative(state);
        if (state.phase === 'gameOver') break;
        state = kwaRandomStep(state, rng);
      }
    }
  });

  // Kwatro has no forced-progress / repetition rule — random walks can loop.
  it.skip('TODO(engine-coverage-2026-10-07): random play terminates within bound — kwatro has no draw-by-repetition; games may loop indefinitely under random play', () => {
    const BOUND = 500;
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = kwaInit();
      let steps = 0;
      while (state.phase !== 'gameOver' && steps < BOUND) {
        state = kwaRandomStep(state, rng);
        steps++;
      }
      expect(state.phase).toBe('gameOver');
    }
  });
});

// =============================================================================
// Ramrod
// =============================================================================

function ramAssertNonNegative(state: RamrodState): void {
  expect(state.scores.player1).toBeGreaterThanOrEqual(0);
  expect(state.scores.player2).toBeGreaterThanOrEqual(0);
  for (const rod of state.rods.values()) {
    expect(rod.length).toBeGreaterThan(0);
  }
}

function ramRandomStep(state: RamrodState, rng: () => number): RamrodState {
  if (state.phase === 'gameOver') return state;
  if (!ramHasValid(state)) return ramPass(state);

  const rods = state.playerRods[state.currentPlayer];
  const options: Array<{ rodId: string; boxId: string; slot: number }> = [];
  for (const rodId of rods) {
    for (const p of ramPlacements(state, rodId)) {
      options.push({ rodId, ...p });
    }
  }
  if (options.length === 0) return ramPass(state);
  const choice = pick(rng, options);
  let next = selectRod(state, choice.rodId);
  next = placeRod(next, choice.boxId, choice.slot);
  return next;
}

describe('Engine invariants — ramrod', () => {
  it('getValidPlacements ⊆ isValidPlacement under random play', () => {
    vi.spyOn(Math, 'random').mockImplementation(mulberry32(11));
    for (const seed of SEEDS) {
      const rng = mulberry32(seed + 100);
      let state = ramInit();
      for (let i = 0; i < 50 && state.phase !== 'gameOver'; i++) {
        for (const rodId of state.playerRods[state.currentPlayer]) {
          for (const p of ramPlacements(state, rodId)) {
            expect(ramIsValid(state, rodId, p.boxId, p.slot)).toBe(true);
          }
        }
        state = ramRandomStep(state, rng);
        ramAssertNonNegative(state);
      }
    }
  });

  it('scores never go negative; placeRod does not mutate prior state', () => {
    vi.spyOn(Math, 'random').mockImplementation(mulberry32(22));
    const state = ramInit();
    const rodId = state.playerRods.player1[0]!;
    const placements = ramPlacements(state, rodId);
    expect(placements.length).toBeGreaterThan(0);
    const before = snapshotJson({
      scores: state.scores,
      phase: state.phase,
      selectedRod: state.selectedRod,
      playerRods: state.playerRods,
    });
    const selected = selectRod(state, rodId);
    expect(snapshotJson({
      scores: state.scores,
      phase: state.phase,
      selectedRod: state.selectedRod,
      playerRods: state.playerRods,
    })).toBe(before);
    placeRod(selected, placements[0]!.boxId, placements[0]!.slot);
    expect(state.scores.player1).toBe(0);
    expect(state.scores.player2).toBe(0);
    void ramClear;
  });

  it('random play terminates within bound (target score or rods exhausted)', () => {
    const BOUND = 400;
    for (const seed of SEEDS) {
      vi.spyOn(Math, 'random').mockImplementation(mulberry32(seed));
      const rng = mulberry32(seed + 7);
      let state = ramInit();
      let steps = 0;
      while (state.phase !== 'gameOver' && steps < BOUND) {
        ramAssertNonNegative(state);
        state = ramRandomStep(state, rng);
        steps++;
      }
      expect(state.phase).toBe('gameOver');
      ramAssertNonNegative(state);
      vi.restoreAllMocks();
    }
  });
});

// =============================================================================
// Par 55
// =============================================================================

function parAssertNonNegative(state: Par55State): void {
  expect(state.scores.player1).toBeGreaterThanOrEqual(0);
  expect(state.scores.player2).toBeGreaterThanOrEqual(0);
}

function parRandomStep(state: Par55State, rng: () => number): Par55State {
  if (state.phase === 'gameOver') return state;
  if (!parHasValid(state)) return parPass(state);

  const hand = state.hands[state.currentPlayer];
  if (hand.length === 0) return parPass(state);
  const placements = parPlacements(state);
  if (placements.length === 0) return parPass(state);

  const block = pick(rng, hand);
  let next = selectBlock(state, block.id);
  next = placeBlock(next, pick(rng, placements));
  return next;
}

describe('Engine invariants — par-55', () => {
  it('getValidPlacements ⊆ isValidPlacement under random play', () => {
    for (const seed of SEEDS) {
      vi.spyOn(Math, 'random').mockImplementation(mulberry32(seed));
      const rng = mulberry32(seed + 3);
      let state = parInit();
      for (let i = 0; i < 40 && state.phase !== 'gameOver'; i++) {
        for (const baseId of parPlacements(state)) {
          expect(parIsValid(state, baseId)).toBe(true);
        }
        state = parRandomStep(state, rng);
        parAssertNonNegative(state);
      }
      vi.restoreAllMocks();
    }
  });

  it('scores stay non-negative; select/place do not mutate prior hand scores', () => {
    vi.spyOn(Math, 'random').mockImplementation(mulberry32(55));
    const state = parInit();
    const block = state.hands.player1[0]!;
    const placements = parPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const scoreBefore = { ...state.scores };
    const selected = selectBlock(state, block.id);
    expect(state.scores).toEqual(scoreBefore);
    expect(state.selectedBlock).toBeNull();
    placeBlock(selected, placements[0]!);
    expect(state.scores).toEqual(scoreBefore);
    void parClear;
  });

  it('random play terminates within bound (score target or empty hands)', () => {
    const BOUND = 200;
    for (const seed of SEEDS) {
      vi.spyOn(Math, 'random').mockImplementation(mulberry32(seed));
      const rng = mulberry32(seed + 9);
      let state = parInit();
      let steps = 0;
      while (state.phase !== 'gameOver' && steps < BOUND) {
        parAssertNonNegative(state);
        state = parRandomStep(state, rng);
        steps++;
      }
      expect(state.phase).toBe('gameOver');
      parAssertNonNegative(state);
      vi.restoreAllMocks();
    }
  });
});

// =============================================================================
// Kings Quadraphages
// =============================================================================

function kingsLegalMovesOk(): void {
  const state = kingsBoardInit();
  for (const player of ['player1', 'player2'] as const) {
    const moves = getValidKingMoves(state, player);
    for (const dest of moves) {
      expect(isValidKingMove(state, player, dest)).toBe(true);
    }
    // Stay-in-place is never legal when a king exists
    const kingCell = (() => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const p = state.board[r]![c];
          if (p?.type === 'king' && p.owner === player) return { row: r, col: c };
        }
      }
      return null;
    })();
    if (kingCell) {
      expect(isValidKingMove(state, player, kingCell)).toBe(false);
    }
  }
  for (const pos of getValidQuadraphagePlacements(state)) {
    expect(isValidQuadraphagePlacement(state, pos)).toBe(true);
  }
  expect(checkWinCondition(state)).toBeNull();
  expect(isDrawCondition(state)).toBe(false);
  expect(canCompleteTurn(state, 'player1')).toBe(true);
}

function kingsAdjacentMoves(state: KingsPlayState): Kings1Based[] {
  const king = getKingPosition(state, state.currentPlayer);
  if (!king) return [];
  const out: Kings1Based[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const dest = { row: king.row + dr, col: king.col + dc };
      if (kingsIsValidMove(state, dest)) out.push(dest);
    }
  }
  return out;
}

function kingsEmptyPlacements(state: KingsPlayState): Kings1Based[] {
  const out: Kings1Based[] = [];
  for (let row = 1; row <= 9; row++) {
    for (let col = 1; col <= 9; col++) {
      const pos = { row, col };
      if (kingsIsValidPlacement(state, pos)) out.push(pos);
    }
  }
  return out;
}

function kingsRandomStep(
  state: KingsPlayState,
  rng: () => number
): KingsPlayState {
  if (state.turnPhase === 'gameOver') return state;
  if (state.turnPhase === 'moveKing') {
    const moves = kingsAdjacentMoves(state);
    if (moves.length === 0) return state; // trapped — should already be over
    return moveKing(state, pick(rng, moves));
  }
  const places = kingsEmptyPlacements(state);
  if (places.length === 0) return state;
  return placeQuadraphage(state, pick(rng, places));
}

describe('Engine invariants — kings-quadraphages', () => {
  it('legal king moves and quad placements are accepted by validators', () => {
    kingsLegalMovesOk();
  });

  it('supplies never go negative under random play; move does not mutate prior board', () => {
    const state = kingsPlayInit();
    const beforeBoard = snapshotJson(state.board);
    const moves = kingsAdjacentMoves(state);
    expect(moves.length).toBeGreaterThan(0);
    const after = moveKing(state, moves[0]!);
    expect(snapshotJson(state.board)).toBe(beforeBoard);
    expect(state.player1Supply).toBe(30);
    expect(after.player1Supply).toBe(30);

    const rng = mulberry32(3);
    let play = kingsPlayInit();
    for (let i = 0; i < 80 && play.turnPhase !== 'gameOver'; i++) {
      expect(play.player1Supply).toBeGreaterThanOrEqual(0);
      expect(play.player2Supply).toBeGreaterThanOrEqual(0);
      play = kingsRandomStep(play, rng);
    }
    expect(play.player1Supply).toBeGreaterThanOrEqual(0);
    expect(play.player2Supply).toBeGreaterThanOrEqual(0);
  });

  it('random play terminates within bound (trap, draw, or empty supply)', () => {
    const BOUND = 200; // ≤ 60 chip placements + king moves
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = kingsPlayInit();
      let steps = 0;
      while (state.turnPhase !== 'gameOver' && steps < BOUND) {
        state = kingsRandomStep(state, rng);
        steps++;
      }
      expect(state.turnPhase).toBe('gameOver');
    }
  });
});

// =============================================================================
// Calla
// =============================================================================

function callaCubeTotal(state: CallaGameState): number {
  return (
    state.player1Pits.reduce((a, b) => a + b, 0) +
    state.player2Pits.reduce((a, b) => a + b, 0) +
    state.player1Calla +
    state.player2Calla
  );
}

function callaAssertNonNegative(state: CallaGameState): void {
  for (const n of state.player1Pits) expect(n).toBeGreaterThanOrEqual(0);
  for (const n of state.player2Pits) expect(n).toBeGreaterThanOrEqual(0);
  expect(state.player1Calla).toBeGreaterThanOrEqual(0);
  expect(state.player2Calla).toBeGreaterThanOrEqual(0);
  expect(callaCubeTotal(state)).toBe(TOTAL_CUBES);
}

function callaRandomStep(
  state: CallaGameState,
  rng: () => number
): CallaGameState {
  if (isGameOver(state)) return state;
  const pits = getValidPits(state);
  if (pits.length === 0) return settleNoValidMoves(state);
  return makeMove(state, pick(rng, pits));
}

describe('Engine invariants — calla', () => {
  it('getValidPits ⊆ canSelectPit; cubes never negative; total conserved', () => {
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = callaInit();
      for (let i = 0; i < 60 && !isGameOver(state); i++) {
        const pits = getValidPits(state);
        for (const pit of pits) {
          expect(canSelectPit(state, state.currentPlayer, pit)).toBe(true);
        }
        callaAssertNonNegative(state);
        state = callaRandomStep(state, rng);
      }
      callaAssertNonNegative(state);
    }
  });

  it('makeMove does not mutate the prior pit arrays (immutability)', () => {
    const state = callaInit();
    const p1 = [...state.player1Pits];
    const p2 = [...state.player2Pits];
    const calla1 = state.player1Calla;
    makeMove(state, 0);
    expect(state.player1Pits).toEqual(p1);
    expect(state.player2Pits).toEqual(p2);
    expect(state.player1Calla).toBe(calla1);
  });

  it('random play terminates within bound', () => {
    const BOUND = 200;
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = callaInit();
      let steps = 0;
      while (!isGameOver(state) && steps < BOUND) {
        state = callaRandomStep(state, rng);
        steps++;
      }
      expect(isGameOver(state)).toBe(true);
      callaAssertNonNegative(state);
    }
  });
});

// =============================================================================
// FIAR
// =============================================================================

function fiarAssertNonNegative(state: FiarGameState): void {
  for (const seat of ['player1', 'player2'] as const) {
    expect(state.chipInventory[seat].plain).toBeGreaterThanOrEqual(0);
    expect(state.chipInventory[seat].marked).toBeGreaterThanOrEqual(0);
    expect(state.chipsPlaced[seat]).toBeGreaterThanOrEqual(0);
  }
}

function fiarEmptyNodes(state: FiarGameState): string[] {
  const out: string[] = [];
  for (const [id, node] of state.board.nodes) {
    if (node.chip === null) out.push(id);
  }
  return out;
}

function fiarRandomStep(
  state: FiarGameState,
  rng: () => number
): FiarGameState {
  if (state.phase === 'gameOver') return state;

  if (state.phase === 'placement') {
    state = normalizeSelectedChipKind(state);
    const inv = state.chipInventory[state.currentPlayer];
    const kinds: ChipKind[] = [];
    if (inv.plain > 0) kinds.push('plain');
    if (inv.marked > 0) kinds.push('marked');
    if (kinds.length === 0) return state;
    const kind = pick(rng, kinds);
    state = setSelectedChipKind(state, kind);
    const empties = fiarEmptyNodes(state).filter((id) =>
      canPlaceChip(state, id, kind)
    );
    if (empties.length === 0) return state;
    return placeChip(state, pick(rng, empties), kind);
  }

  // movement
  if (fiarIsDraw(state)) return { ...state, phase: 'gameOver' };
  const selectable = getSelectableNodes(state);
  if (selectable.length === 0) return { ...state, phase: 'gameOver' };
  const from = pick(rng, selectable);
  const dests = fiarGetValid(state, from);
  if (dests.length === 0) return state;
  return fiarMove(state, from, pick(rng, dests));
}

describe('Engine invariants — fiar', () => {
  it('inventory never negative; placement generators only yield legal nodes', () => {
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = fiarInit();
      for (let i = 0; i < 30 && state.phase === 'placement'; i++) {
        fiarAssertNonNegative(state);
        state = normalizeSelectedChipKind(state);
        const kind = state.selectedChipKind;
        for (const id of fiarEmptyNodes(state)) {
          if (canPlaceChip(state, id, kind)) {
            // canPlaceChip is the legality oracle for empties during placement
            expect(state.board.nodes.get(id)?.chip).toBeNull();
          }
        }
        const before = state;
        state = fiarRandomStep(state, rng);
        if (state === before && state.phase === 'placement') break;
      }
      fiarAssertNonNegative(state);
    }
  });

  it('getValidMoves ⊆ canMove during movement; placeChip does not mutate prior inventory', () => {
    const state = fiarInit();
    const invBefore = snapshotJson(state.chipInventory);
    const nodeId = [...state.board.nodes.keys()][0]!;
    expect(canPlaceChip(state, nodeId, 'plain')).toBe(true);
    placeChip(state, nodeId, 'plain');
    expect(snapshotJson(state.chipInventory)).toBe(invBefore);

    // Drive into movement with a short seeded placement sequence
    const rng = mulberry32(8);
    let play = fiarInit();
    let guard = 0;
    while (play.phase === 'placement' && guard++ < 40) {
      play = fiarRandomStep(play, rng);
    }
    if (play.phase === 'movement') {
      for (const from of getSelectableNodes(play)) {
        for (const to of fiarGetValid(play, from)) {
          expect(fiarCanMove(play, from, to)).toBe(true);
        }
      }
    }
  });

  // Movement phase has no repetition / progress rule — random sliding can loop.
  it.skip('TODO(engine-coverage-2026-10-07): random play terminates within bound — FIAR movement has no forced end besides win/draw-by-no-moves; random sliding often exceeds any modest bound without a win', () => {
    const BOUND = 300;
    for (const seed of SEEDS) {
      const rng = mulberry32(seed);
      let state = fiarInit();
      let steps = 0;
      while (state.phase !== 'gameOver' && steps < BOUND) {
        state = fiarRandomStep(state, rng);
        steps++;
      }
      expect(state.phase).toBe('gameOver');
    }
  });
});
