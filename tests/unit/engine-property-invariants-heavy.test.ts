/**
 * Engine property invariants — heavy game group (q-mp-1351).
 * Same playout / validator assertions as the pre-shard suite for:
 * fab-a-diffy, fiar, pent-em-in, queens-guards, ramrod.
 */
import { describe, it, expect } from 'vitest';

import {
  PROPERTY_SEEDS,
  PROPERTY_MAX_PLIES,
  LEGAL_SAMPLE_CAP,
  runPropertyPlayout,
} from './helpers/engine-property-invariants';
import {
  ENGINE_PROPERTY_HEAVY_IDS,
  adaptersByIds,
} from './helpers/engine-property-invariants-groups';

import { pick } from './engine-invariants-helpers';
import { createRng } from './helpers/state-roundtrip';

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

const HEAVY = adaptersByIds(ENGINE_PROPERTY_HEAVY_IDS);

describe('Engine property invariants — seeded playouts (heavy games)', () => {
  for (const adapter of HEAVY) {
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

describe('Engine property invariants — legal ⊆ validator (heavy secondary)', () => {
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
              for (const pos of pentPlacements(state, shapeId, rot, flipped)) {
                expect(canPlacePiece(state, shapeId, pos, rot, flipped)).toBe(
                  true
                );
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
});
