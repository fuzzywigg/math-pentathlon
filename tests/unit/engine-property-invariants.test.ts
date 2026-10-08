/**
 * Property-style / randomized invariant tests for every rules engine.
 *
 * Stacked on the integration tip. Tests only — reuses GameFuzzAdapter,
 * engine-invariants-helpers (mulberry32), and undo-audit serializeState.
 * No fast-check. Deterministic seeds for CI reproducibility.
 *
 * Invariants (all 20 games unless noted):
 * - legal-move generation: sampled legal moves apply without throw + round-trip
 * - apply keeps state valid (seat, normalize idempotent)
 * - turn order: seat changes flip to opponent; hex strictly alternates
 * - undo: prefix replay restores snapshots exactly
 * - game-over: isOver ⇒ empty legalMoves; stable under roundTrip
 * - serialization: adapter.roundTrip preserves normalize(state)
 */
import { describe, it, expect } from 'vitest';

import { ALL_GAME_ADAPTERS } from './helpers/state-roundtrip-games';
import {
  PROPERTY_SEEDS,
  PROPERTY_MAX_PLIES,
  LEGAL_SAMPLE_CAP,
  runPropertyPlayout,
  assertHexStrictAlternation,
  SAME_SEAT_OK_GAMES,
  STRICT_ALTERNATE_GAMES,
} from './helpers/engine-property-invariants';

import { mulberry32, pick } from './engine-invariants-helpers';
import { withSeededMathRandom, createRng } from './helpers/state-roundtrip';

import {
  isValidMove as hexIsValid,
  getValidMoves as hexLegal,
  makeMove as hexMake,
} from '../../src/games/hex/rules';
import { createInitialState as createHex } from '../../src/games/hex/types';

import {
  isValidPlacement as sumIsValid,
  getValidPlacements as sumPlacements,
  doRollDice as sumRoll,
  selectDomino,
  placeDomino,
  passTurn as sumPass,
  createInitialState as createSum,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

import {
  getValidPlacements as primePlacements,
  rollDice as primeRoll,
  placeChip as primePlace,
  passTurn as primePass,
  hasValidMoves as primeHas,
  createInitialState as createPrime,
} from '../../src/games/prime-gold/rules';

import {
  getValidPlacements as starsPlacements,
  placeCard,
  selectCard,
  passTurn as starsPass,
  hasValidMoves as starsHas,
  createInitialState as createStars,
} from '../../src/games/stars-bars/rules';

import {
  canPlaceAt as hagCanPlace,
  getValidPlacements as hagPlacements,
  selectBlock as hagSelect,
  commitSelection,
  placeBlock as hagPlace,
  passTurn as hagPass,
  canPlayerMove as hagCanMove,
  isGameOver as hagIsOver,
} from '../../src/games/hex-a-gone/rules';
import {
  createInitialState as createHag,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';

import {
  getValidMoves as queensLegal,
  makeMove as queensMake,
  getRestoreTargets,
  restoreCapturedPiece,
} from '../../src/games/queens-guards/rules';
import {
  createInitialState as createQueens,
  parseKey,
} from '../../src/games/queens-guards/types';

import {
  canPlacePiece,
  getValidPlacements as pentPlacements,
  placePiece,
  canPlayerMove as pentCanMove,
} from '../../src/games/pent-em-in/rules';
import {
  createInitialState as createPent,
  getPlayerPieces,
  getPentominoShape,
} from '../../src/games/pent-em-in/types';

import {
  isPlacementValid as juggleIsValid,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  placeShape,
  rotateShape,
  flipShape,
  canMakeAnyMove,
  createInitialState as createJuggle,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { findValidPlacements } from '../../src/core/polyomino/placement';

import {
  getValidPlacements as contigPlacements,
  createInitialState as createContig,
} from '../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  placeChip as contigPlace,
  passTurn as contigPass,
} from '../../src/games/contig-60/rules';

describe('Engine property invariants — registry', () => {
  it('covers all 20 registered games', () => {
    expect(ALL_GAME_ADAPTERS.map((a) => a.id).sort()).toEqual(
      [
        'calla',
        'contig-60',
        'fab-a-diffy',
        'fiar',
        'frac-fact',
        'fraction-pinball',
        'hex',
        'hex-a-gone',
        'juggle',
        'kings-quadraphages',
        'kwatro-sinko',
        'par-55',
        'pent-em-in',
        'prime-gold',
        'queens-guards',
        'ramrod',
        'remainder-islands',
        'star-track',
        'stars-bars',
        'sum-dominoes',
      ].sort()
    );
  });

  it('documents seat-policy sets', () => {
    expect(STRICT_ALTERNATE_GAMES.has('hex')).toBe(true);
    expect(SAME_SEAT_OK_GAMES.has('calla')).toBe(true);
    expect(SAME_SEAT_OK_GAMES.has('kings-quadraphages')).toBe(true);
  });
});

describe('Engine property invariants — seeded playouts (all games)', () => {
  for (const adapter of ALL_GAME_ADAPTERS) {
    it(`${adapter.id}: legal / valid / turn / undo / game-over / round-trip`, () => {
      for (const seed of PROPERTY_SEEDS) {
        const result = runPropertyPlayout(adapter, seed, {
          maxPlies: Math.min(adapter.maxMoves, PROPERTY_MAX_PLIES),
          legalSampleCap: LEGAL_SAMPLE_CAP,
        });
        expect(result.movesPlayed).toBeGreaterThanOrEqual(0);
      }
    });
  }

  it('hex: seat strictly alternates until terminal', () => {
    const hex = ALL_GAME_ADAPTERS.find((a) => a.id === 'hex');
    expect(hex).toBeDefined();
    for (const seed of PROPERTY_SEEDS) {
      assertHexStrictAlternation(hex!, seed);
    }
  });
});

// =============================================================================
// Validator cross-checks for engines not covered by engine-coverage-invariants
// (legal generator ⊆ isValid / canPlace oracle under seeded random play).
// =============================================================================

describe('Engine property invariants — legal ⊆ validator (secondary engines)', () => {
  it('hex: getValidMoves ⊆ isValidMove under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = mulberry32(seed);
      let state = createHex(5);
      for (let i = 0; i < 20 && !state.winner; i++) {
        const moves = hexLegal(state);
        for (const m of moves) {
          expect(hexIsValid(state, m)).toBe(true);
        }
        if (moves.length === 0) break;
        state = hexMake(state, pick(rng, moves));
      }
    }
  });

  it('sum-dominoes: getValidPlacements ⊆ isValidPlacement under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = withSeededMathRandom(seed, () => createSum());
      for (let i = 0; i < 20 && state.phase !== 'gameOver'; i++) {
        if (state.phase === 'rolling') {
          state = withSeededMathRandom(seed + i, () => sumRoll(state));
          continue;
        }
        if (state.phase === 'passing' || !state.currentDice) {
          state = sumPass(state);
          continue;
        }
        const sum = getDiceSum(state.currentDice);
        for (const d of state.hands[state.currentPlayer]) {
          for (const p of sumPlacements(state, d, sum)) {
            expect(
              sumIsValid(state, d, p.position, p.orientation, sum)
            ).toBe(true);
          }
        }
        const options: Array<{
          id: string;
          row: number;
          col: number;
          orientation: 'horizontal' | 'vertical';
        }> = [];
        for (const d of state.hands[state.currentPlayer]) {
          for (const p of sumPlacements(state, d, sum)) {
            options.push({
              id: d.id,
              row: p.position.row,
              col: p.position.col,
              orientation: p.orientation,
            });
          }
        }
        if (options.length === 0) {
          state = sumPass(state);
          continue;
        }
        const choice = pick(rng, options);
        const next = selectDomino(state, choice.id);
        state = placeDomino(
          next,
          { row: choice.row, col: choice.col },
          choice.orientation
        );
      }
    }
  });

  it('prime-gold: getValidPlacements ⊆ placeable under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createPrime();
      for (let i = 0; i < 20 && state.phase !== 'gameOver'; i++) {
        if (state.phase === 'rolling') {
          state = withSeededMathRandom(seed + i, () => primeRoll(state));
          continue;
        }
        const spots = primePlacements(state);
        if (!primeHas(state) || spots.length === 0) {
          state = primePass(state);
          continue;
        }
        for (const spot of spots.slice(0, LEGAL_SAMPLE_CAP)) {
          expect(typeof spot.value).toBe('number');
          expect(spot.expr.length).toBeGreaterThan(0);
        }
        const choice = pick(rng, spots);
        state = primePlace(state, choice.value, choice.expr);
      }
    }
  });

  it('stars-bars: getValidPlacements re-query stable; places under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = withSeededMathRandom(seed, () => createStars());
      for (let i = 0; i < 20 && state.phase !== 'gameOver'; i++) {
        if (!starsHas(state)) {
          state = starsPass(state);
          continue;
        }
        const spots = starsPlacements(state);
        const again = starsPlacements(state);
        expect(again).toEqual(spots);
        const hand = state.playerHands[state.currentPlayer];
        if (hand.length === 0 || spots.length === 0) {
          state = starsPass(state);
          continue;
        }
        const card = pick(rng, hand);
        const spot = pick(rng, spots);
        const next = selectCard(state, card.id);
        state = placeCard(next, spot.row, spot.col);
      }
    }
  });

  it('hex-a-gone: getValidPlacements ⊆ canPlaceAt under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createHag();
      for (let i = 0; i < 24 && !hagIsOver(state); i++) {
        if (state.phase === 'selectBlocks') {
          const available = getAvailableShapes(state);
          if (available.length === 0 || !hagCanMove(state)) {
            state = hagPass(state);
            continue;
          }
          const shape = pick(rng, available);
          state = hagSelect(state, shape);
          if (state.turnSelection.blocks.length > 0) {
            state = commitSelection(state);
          }
          continue;
        }
        const spots = hagPlacements(state);
        for (const p of spots) {
          expect(hagCanPlace(state, p.q, p.r)).toBe(true);
        }
        if (spots.length === 0) break;
        const choice = pick(rng, spots);
        state = hagPlace(state, choice.q, choice.r);
      }
    }
  });

  it('queens-guards: getValidMoves re-list stable under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createQueens();
      for (let i = 0; i < 20 && !state.winner; i++) {
        if (state.capturedPieces.length > 0) {
          const from = state.capturedPieces[0]!;
          const targets = getRestoreTargets(state);
          expect(targets.length).toBeGreaterThan(0);
          state = restoreCapturedPiece(state, from, pick(rng, targets));
          continue;
        }
        const options: Array<{
          from: ReturnType<typeof parseKey>;
          to: ReturnType<typeof parseKey>;
        }> = [];
        for (const [key, cell] of state.cells) {
          if (cell.piece?.player !== state.currentPlayer) continue;
          const from = parseKey(key);
          const moves = queensLegal(state, from);
          expect(queensLegal(state, from)).toEqual(moves);
          for (const to of moves) {
            options.push({ from, to });
          }
        }
        if (options.length === 0) break;
        const choice = pick(rng, options);
        state = queensMake(state, choice.from, choice.to);
      }
    }
  });

  it('pent-em-in: getValidPlacements ⊆ canPlacePiece under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createPent();
      for (let i = 0; i < 16 && state.phase !== 'gameOver'; i++) {
        if (!pentCanMove(state, state.currentPlayer)) break;
        const pieces = getPlayerPieces(state, state.currentPlayer);
        const options: Array<{
          shapeId: string;
          row: number;
          col: number;
          rotation: 0 | 90 | 180 | 270;
          flipped: boolean;
        }> = [];
        for (const shapeId of pieces.available) {
          const shape = getPentominoShape(shapeId);
          if (!shape) continue;
          const rotations = shape.canRotate
            ? ([0, 90, 180, 270] as const)
            : ([0] as const);
          const flips = shape.canFlip ? [false, true] : [false];
          for (const rot of rotations) {
            for (const flipped of flips) {
              for (const pos of pentPlacements(
                state,
                shapeId,
                rot,
                flipped
              )) {
                expect(
                  canPlacePiece(state, shapeId, pos, rot, flipped)
                ).toBe(true);
                options.push({
                  shapeId,
                  row: pos.row,
                  col: pos.col,
                  rotation: rot,
                  flipped,
                });
              }
            }
          }
        }
        if (options.length === 0) break;
        const choice = pick(rng, options);
        state = placePiece(
          state,
          choice.shapeId,
          { row: choice.row, col: choice.col },
          choice.rotation,
          choice.flipped
        );
      }
    }
  });

  it('juggle: enumerated placements ⊆ isPlacementValid under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createJuggle();
      for (let i = 0; i < 16 && state.phase !== 'gameOver'; i++) {
        if (state.phase === 'rolling' || !state.currentDice) {
          state = withSeededMathRandom(seed + i, () => juggleRoll(state));
          continue;
        }
        if (!canMakeAnyMove(state)) break;

        const options: Array<{
          dieIndex: 0 | 1;
          shapeId: string;
          rot: 0 | 90 | 180 | 270;
          flipped: boolean;
          row: number;
          col: number;
        }> = [];

        for (const dieIndex of [0, 1] as const) {
          for (const shape of getShapesForDie(state.currentDice[dieIndex])) {
            const rotations = shape.canRotate
              ? ([0, 90, 180, 270] as const)
              : ([0] as const);
            const flips = shape.canFlip ? [false, true] : [false];
            for (const rot of rotations) {
              for (const flipped of flips) {
                for (const pos of findValidPlacements(
                  state.boards[state.currentPlayer],
                  shape,
                  rot,
                  flipped
                )) {
                  options.push({
                    dieIndex,
                    shapeId: shape.id,
                    rot,
                    flipped,
                    row: pos.row,
                    col: pos.col,
                  });
                }
              }
            }
          }
        }

        // Validate a sample via isPlacementValid after orienting selection
        for (const opt of options.slice(0, LEGAL_SAMPLE_CAP)) {
          let probe = selectDie(state, opt.dieIndex);
          const shape = getShapesForDie(
            probe.currentDice![opt.dieIndex]
          ).find((s) => s.id === opt.shapeId);
          if (!shape) continue;
          if (probe.phase === 'selectingShape') {
            probe = selectShape(probe, shape);
          }
          let guard = 0;
          while (probe.selectedRotation !== opt.rot && guard++ < 4) {
            probe = rotateShape(probe);
          }
          if (probe.selectedFlipped !== opt.flipped) {
            probe = flipShape(probe);
          }
          // orientSelectedShapeToFit may force a fitting orientation; only
          // assert when we successfully reached the requested orientation.
          if (
            probe.selectedRotation === opt.rot &&
            probe.selectedFlipped === opt.flipped
          ) {
            expect(
              juggleIsValid(probe, { row: opt.row, col: opt.col })
            ).toBe(true);
          }
        }

        if (options.length === 0) break;
        const choice = pick(rng, options);
        let next = selectDie(state, choice.dieIndex);
        const shape = getShapesForDie(next.currentDice![choice.dieIndex]).find(
          (s) => s.id === choice.shapeId
        );
        if (!shape) break;
        if (next.phase === 'selectingShape') {
          next = selectShape(next, shape);
        }
        let guard = 0;
        while (next.selectedRotation !== choice.rot && guard++ < 4) {
          next = rotateShape(next);
        }
        if (next.selectedFlipped !== choice.flipped) {
          next = flipShape(next);
        }
        // If orientation could not be reached (auto-orient), skip this trial step
        if (
          next.selectedRotation !== choice.rot ||
          next.selectedFlipped !== choice.flipped
        ) {
          // Fall back: place at any valid cell for the current orientation
          const fits = findValidPlacements(
            next.boards[next.currentPlayer],
            next.selectedShape!,
            next.selectedRotation,
            next.selectedFlipped
          );
          if (fits.length === 0) break;
          state = placeShape(next, pick(rng, fits));
          continue;
        }
        state = placeShape(next, { row: choice.row, col: choice.col });
      }
    }
  });

  it('contig-60: getValidPlacements results are placeable under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createContig();
      for (let i = 0; i < 20 && state.phase !== 'gameOver'; i++) {
        if (state.phase === 'rolling') {
          state = withSeededMathRandom(seed + i, () => contigRoll(state));
          continue;
        }
        if (!state.currentDice) {
          state = contigPass(state);
          continue;
        }
        const spots = contigPlacements(state, state.currentDice);
        for (const s of spots) {
          expect(typeof s.result).toBe('number');
          expect(s.expression.length).toBeGreaterThan(0);
        }
        if (spots.length === 0) {
          state = contigPass(state);
          continue;
        }
        const choice = pick(rng, spots);
        state = contigPlace(state, choice.result, choice.expression);
      }
    }
  });
});
