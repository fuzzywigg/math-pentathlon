/**
 * Undo/redo property tests for polyomino Board (only product undo surface).
 * Random legal place → N undos restore earlier board; redo re-places identically.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  removeLastPolyomino,
  findValidPlacements,
} from '../../src/core/polyomino/placement';
import {
  SIMPLE_SHAPES,
  TETROMINOES,
  Rotation,
} from '../../src/core/polyomino/types';
import {
  assertUndoRedoMoveLog,
  mulberry32,
  pickOne,
  serializeState,
} from './undo-audit-helpers';

const SHAPES = [...SIMPLE_SHAPES, ...TETROMINOES];
const ROTATIONS: Rotation[] = [0, 90, 180, 270];

type Applied = {
  shapeId: string;
  position: { row: number; col: number };
  rotation: Rotation;
  flipped: boolean;
};

function boardFingerprint(board: ReturnType<typeof createBoard>): string {
  return serializeState({
    cells: board.cells,
    placements: board.placements,
  });
}

describe('Undo audit — polyomino removeLast / place redo', () => {
  it('random legal places: undo N restores; redo replays; placements log matches', () => {
    assertUndoRedoMoveLog({
      label: 'polyomino',
      trials: 32,
      maxPlies: 12,
      create: () => createBoard(10, 10),
      step: (board, rng) => {
        const candidates: Applied[] = [];
        for (const shape of SHAPES) {
          const rotations = shape.canRotate ? ROTATIONS : ([0] as Rotation[]);
          const flips = shape.canFlip ? [false, true] : [false];
          for (const rotation of rotations) {
            for (const flipped of flips) {
              for (const position of findValidPlacements(
                board,
                shape,
                rotation,
                flipped
              )) {
                candidates.push({
                  shapeId: shape.id,
                  position,
                  rotation,
                  flipped,
                });
              }
            }
          }
        }
        if (candidates.length === 0) return null;
        // Cap candidate scan cost: sample among first 200 + random tail
        const pool =
          candidates.length > 200
            ? [
                ...candidates.slice(0, 100),
                ...Array.from({ length: 100 }, () =>
                  pickOne(rng, candidates)
                ),
              ]
            : candidates;
        const applied = pickOne(rng, pool);
        const shape = SHAPES.find((s) => s.id === applied.shapeId)!;
        const next = placePolyomino(
          board,
          shape,
          applied.position,
          applied.rotation,
          applied.flipped
        );
        const logEntry = next.placements[next.placements.length - 1];
        return { state: next, applied, logEntry };
      },
      reapply: (board, applied) => {
        const shape = SHAPES.find((s) => s.id === applied.shapeId)!;
        return placePolyomino(
          board,
          shape,
          applied.position,
          applied.rotation,
          applied.flipped
        );
      },
      getHistory: (board) => board.placements,
      historyMatches: (entry, applied) => {
        const e = entry as Applied;
        return (
          e.shapeId === applied.shapeId &&
          e.position.row === applied.position.row &&
          e.position.col === applied.position.col &&
          e.rotation === applied.rotation &&
          e.flipped === applied.flipped
        );
      },
      fingerprint: boardFingerprint,
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
