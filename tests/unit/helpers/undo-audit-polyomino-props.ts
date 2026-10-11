/**
 * Shared polyomino undo-audit runner for early/late shards (q-mp-1366).
 * Preserves pre-shard seeds and total trial count (32 = 16 early + 16 late).
 */
import {
  createBoard,
  placePolyomino,
  findValidPlacements,
} from '../../../src/core/polyomino/placement';
import {
  SIMPLE_SHAPES,
  TETROMINOES,
  Rotation,
} from '../../../src/core/polyomino/types';
import {
  assertUndoRedoMoveLog,
  pickOne,
  serializeState,
} from '../undo-audit-helpers';

/** Pre-shard total for the random-legal-places property (do not drop). */
export const POLYOMINO_RANDOM_LEGAL_TOTAL_TRIALS = 32;
export const POLYOMINO_RANDOM_LEGAL_EARLY_TRIALS = 16;
export const POLYOMINO_RANDOM_LEGAL_LATE_TRIALS = 16;
export const POLYOMINO_RANDOM_LEGAL_LATE_OFFSET = 16;

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

/** Same assertions/seeds as the pre-shard 32-trial case; window via offset. */
export function runPolyominoRandomLegalPlacesAudit(opts: {
  trials: number;
  trialOffset?: number;
}): void {
  assertUndoRedoMoveLog({
    label: 'polyomino',
    trials: opts.trials,
    trialOffset: opts.trialOffset ?? 0,
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
              ...Array.from({ length: 100 }, () => pickOne(rng, candidates)),
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
}

export { boardFingerprint, SHAPES, SIMPLE_SHAPES };
export type { Applied };
