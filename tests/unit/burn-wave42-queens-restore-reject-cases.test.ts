/**
 * Wave 42 — Queens & Guards restoreCapturedPiece reject matrix leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { restoreCapturedPiece } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  CONFIG,
  cellKey,
  type QueensGuardsState,
  type BoardCoord,
} from '../../src/games/queens-guards/types';

function withCaptured(
  capturedCoord: BoardCoord,
  opts: { emptyCaptured?: boolean; occupiedOuter?: number } = {}
): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  cells.set(cellKey(capturedCoord.ring, capturedCoord.position), {
    ...cells.get(cellKey(capturedCoord.ring, capturedCoord.position))!,
    piece: opts.emptyCaptured
      ? null
      : {
          id: 'cap',
          player: 'player1',
          type: 'guard' as const,
        },
  });
  if (opts.occupiedOuter !== undefined) {
    const outer = CONFIG.NUM_RINGS - 1;
    cells.set(cellKey(outer, opts.occupiedOuter), {
      ...cells.get(cellKey(outer, opts.occupiedOuter))!,
      piece: { id: 'occ', player: 'player2', type: 'guard' },
    });
  }
  return {
    ...base,
    cells,
    capturedPieces: [capturedCoord],
  };
}

describe('Wave 42 queens — restoreCapturedPiece rejects', () => {
  it('non-outer target ring returns identity', () => {
    const captured: BoardCoord = { ring: 2, position: 0 };
    const state = withCaptured(captured);
    const next = restoreCapturedPiece(state, captured, { ring: 1, position: 0 });
    expect(next).toBe(state);
  });

  it('occupied outer target returns identity', () => {
    const captured: BoardCoord = { ring: 2, position: 1 };
    const outer = CONFIG.NUM_RINGS - 1;
    const state = withCaptured(captured, { occupiedOuter: 0 });
    const next = restoreCapturedPiece(state, captured, {
      ring: outer,
      position: 0,
    });
    expect(next).toBe(state);
  });

  it('empty piece at captured coordinate returns identity', () => {
    const captured: BoardCoord = { ring: 2, position: 2 };
    const outer = CONFIG.NUM_RINGS - 1;
    const state = withCaptured(captured, { emptyCaptured: true });
    const next = restoreCapturedPiece(state, captured, {
      ring: outer,
      position: 5,
    });
    expect(next).toBe(state);
  });
});
