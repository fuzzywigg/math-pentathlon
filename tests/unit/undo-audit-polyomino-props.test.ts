/**
 * Undo/redo property tests for polyomino Board (only product undo surface).
 * Random legal place → N undos restore earlier board; redo re-places identically.
 *
 * q-mp-1366: early shard of the former ~605–715ms random-legal-places case
 * (trials 0..15). Late trials live in undo-audit-polyomino-props-late.test.ts.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  removeLastPolyomino,
  findValidPlacements,
} from '../../src/core/polyomino/placement';
import { mulberry32, pickOne } from './undo-audit-helpers';
import {
  POLYOMINO_RANDOM_LEGAL_EARLY_TRIALS,
  POLYOMINO_RANDOM_LEGAL_LATE_OFFSET,
  POLYOMINO_RANDOM_LEGAL_LATE_TRIALS,
  POLYOMINO_RANDOM_LEGAL_TOTAL_TRIALS,
  SIMPLE_SHAPES,
  SHAPES,
  boardFingerprint,
  runPolyominoRandomLegalPlacesAudit,
  type Applied,
} from './helpers/undo-audit-polyomino-props';

describe('Undo audit — polyomino removeLast / place redo (early)', () => {
  it('shards partition the pre-shard 32 random-legal trials', () => {
    expect(
      POLYOMINO_RANDOM_LEGAL_EARLY_TRIALS + POLYOMINO_RANDOM_LEGAL_LATE_TRIALS
    ).toBe(POLYOMINO_RANDOM_LEGAL_TOTAL_TRIALS);
    expect(POLYOMINO_RANDOM_LEGAL_LATE_OFFSET).toBe(
      POLYOMINO_RANDOM_LEGAL_EARLY_TRIALS
    );
  });

  it('random legal places early: undo N restores; redo replays; placements log matches', () => {
    runPolyominoRandomLegalPlacesAudit({
      trials: POLYOMINO_RANDOM_LEGAL_EARLY_TRIALS,
      trialOffset: 0,
    });
  });

  it('product undo (removeLastPolyomino) matches snapshot after N undos', () => {
    for (let trial = 0; trial < 20; trial++) {
      const rng = mulberry32(1000 + trial * 13);
      let board = createBoard(8, 8);
      const snaps = [boardFingerprint(board)];
      const applied: Applied[] = [];

      for (let i = 0; i < 8; i++) {
        const shape = pickOne(rng, SIMPLE_SHAPES);
        const positions = findValidPlacements(board, shape, 0, false);
        if (positions.length === 0) break;
        const position = pickOne(rng, positions);
        board = placePolyomino(board, shape, position, 0, false);
        applied.push({
          shapeId: shape.id,
          position,
          rotation: 0,
          flipped: false,
        });
        snaps.push(boardFingerprint(board));
      }
      if (applied.length < 2) continue;

      const n = 1 + Math.floor(rng() * applied.length);
      let undone = board;
      for (let i = 0; i < n; i++) {
        undone = removeLastPolyomino(undone, SHAPES);
      }
      expect(boardFingerprint(undone)).toBe(snaps[applied.length - n]);

      // Redo via re-place
      for (let i = applied.length - n; i < applied.length; i++) {
        const a = applied[i]!;
        const shape = SHAPES.find((s) => s.id === a.shapeId)!;
        undone = placePolyomino(
          undone,
          shape,
          a.position,
          a.rotation,
          a.flipped
        );
      }
      expect(boardFingerprint(undone)).toBe(snaps[applied.length]);
    }
  });
});
