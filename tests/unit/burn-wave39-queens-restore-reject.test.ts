/**
 * Wave 39 — Queens & Guards restoreCapturedPiece reject matrix.
 * Wrong ring / occupied / missing piece → identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  restoreCapturedPiece,
} from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  CONFIG,
  cellKey,
  type QueensGuardsState,
  type BoardCoord,
} from '../../src/games/queens-guards/types';

function withCaptured(
  state: QueensGuardsState,
  captured: BoardCoord,
  piece = { id: 'cap-1', player: 'player1' as const, type: 'guard' as const }
): QueensGuardsState {
  const cells = new Map(state.cells);
  const key = cellKey(captured.ring, captured.position);
  const cell = { ...cells.get(key)! };
  cell.piece = piece;
  cells.set(key, cell);
  return {
    ...state,
    cells,
    capturedPieces: [captured],
  };
}

describe('Wave 39 queens — restoreCapturedPiece rejects', () => {
  it('rejects target not on outer ring (identity)', () => {
    const base = createInitialState();
    const captured: BoardCoord = { ring: 2, position: 0 };
    const state = withCaptured(base, captured);
    const next = restoreCapturedPiece(state, captured, {
      ring: 1,
      position: 0,
    });
    expect(next).toBe(state);
  });

  it('rejects occupied outer-ring target', () => {
    const base = createInitialState();
    const outer = CONFIG.NUM_RINGS - 1;
    // Outer ring already has starting pieces — pick one that has a piece
    let occupiedPos = 0;
    for (let p = 0; p < outer * 6; p++) {
      const cell = base.cells.get(cellKey(outer, p));
      if (cell?.piece) {
        occupiedPos = p;
        break;
      }
    }
    const captured: BoardCoord = { ring: 2, position: 1 };
    const state = withCaptured(base, captured);
    const next = restoreCapturedPiece(state, captured, {
      ring: outer,
      position: occupiedPos,
    });
    expect(next).toBe(state);
  });

  it('rejects missing piece at captured coord', () => {
    const base = createInitialState();
    const outer = CONFIG.NUM_RINGS - 1;
    // Empty outer cell
    let emptyPos = 0;
    for (let p = 0; p < outer * 6; p++) {
      if (!base.cells.get(cellKey(outer, p))?.piece) {
        emptyPos = p;
        break;
      }
    }
    const ghost: BoardCoord = { ring: 3, position: 0 };
    const state: QueensGuardsState = {
      ...base,
      capturedPieces: [ghost],
    };
    // Ensure ghost cell has no piece
    const cells = new Map(state.cells);
    const gk = cellKey(ghost.ring, ghost.position);
    cells.set(gk, { ...cells.get(gk)!, piece: null });
    const haunted = { ...state, cells };
    const next = restoreCapturedPiece(haunted, ghost, {
      ring: outer,
      position: emptyPos,
    });
    expect(next).toBe(haunted);
  });

  it('success clears capture and may flip turn', () => {
    const base = createInitialState();
    const outer = CONFIG.NUM_RINGS - 1;
    let emptyPos = 0;
    for (let p = 0; p < outer * 6; p++) {
      if (!base.cells.get(cellKey(outer, p))?.piece) {
        emptyPos = p;
        break;
      }
    }
    const captured: BoardCoord = { ring: 2, position: 2 };
    const state = withCaptured(base, captured);
    const next = restoreCapturedPiece(state, captured, {
      ring: outer,
      position: emptyPos,
    });
    expect(next).not.toBe(state);
    expect(next.capturedPieces).toHaveLength(0);
    expect(next.cells.get(cellKey(outer, emptyPos))?.piece).toBeTruthy();
    expect(next.cells.get(cellKey(captured.ring, captured.position))?.piece).toBeNull();
    expect(next.currentPlayer).toBe('player2');
  });
});
