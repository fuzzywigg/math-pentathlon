/**
 * Engine property invariants — mid game group (q-mp-1351).
 * Same playout / validator assertions as the pre-shard suite for:
 * contig-60, juggle, kwatro-sinko, par-55, prime-gold, stars-bars, sum-dominoes.
 */
import { describe, it, expect } from 'vitest';

import {
  PROPERTY_SEEDS,
  PROPERTY_MAX_PLIES,
  LEGAL_SAMPLE_CAP,
  runPropertyPlayout,
} from './helpers/engine-property-invariants';
import {
  ENGINE_PROPERTY_MID_IDS,
  adaptersByIds,
} from './helpers/engine-property-invariants-groups';

import { pick } from './engine-invariants-helpers';
import { withSeededRandom, createRng } from './helpers/state-roundtrip';

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

const MID = adaptersByIds(ENGINE_PROPERTY_MID_IDS);

describe('Engine property invariants — seeded playouts (mid games)', () => {
  for (const adapter of MID) {
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
});

describe('Engine property invariants — legal ⊆ validator (mid secondary)', () => {
  it('sum-dominoes: getValidPlacements ⊆ isValidPlacement under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = withSeededRandom(seed, () => createSum());
      for (let i = 0; i < 20 && state.phase !== 'gameOver'; i++) {
        if (state.phase === 'rolling') {
          state = withSeededRandom(seed + i, () => sumRoll(state));
          continue;
        }
        if (state.phase === 'passing' || !state.currentDice) {
          state = sumPass(state);
          continue;
        }
        const sum = getDiceSum(state.currentDice);
        for (const d of state.hands[state.currentPlayer]) {
          for (const p of sumPlacements(state, d, sum)) {
            expect(sumIsValid(state, d, p.position, p.orientation, sum)).toBe(
              true
            );
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
          state = withSeededRandom(seed + i, () => primeRoll(state));
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
      let state = withSeededRandom(seed, () => createStars());
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

  it('juggle: enumerated placements ⊆ isPlacementValid under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createJuggle();
      for (let i = 0; i < 16 && state.phase !== 'gameOver'; i++) {
        if (state.phase === 'rolling' || !state.currentDice) {
          state = withSeededRandom(seed + i, () => juggleRoll(state));
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
          const shape = getShapesForDie(probe.currentDice![opt.dieIndex]).find(
            (s) => s.id === opt.shapeId
          );
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
            expect(juggleIsValid(probe, { row: opt.row, col: opt.col })).toBe(
              true
            );
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
          state = withSeededRandom(seed + i, () => contigRoll(state));
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
