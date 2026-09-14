/**
 * Wave 42 — Queens & Guards restoreCapturedPiece success clear/flip leftovers after #186.
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

function emptyOuterPos(state: QueensGuardsState): number {
  const outer = CONFIG.NUM_RINGS - 1;
  const count = 6 * outer;
  for (let p = 0; p < count; p++) {
    if (!state.cells.get(cellKey(outer, p))?.piece) return p;
  }
  throw new Error('no empty outer cell');
}

function withCapturedPiece(coord: BoardCoord): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  cells.set(cellKey(coord.ring, coord.position), {
    ...cells.get(cellKey(coord.ring, coord.position))!,
    piece: { id: 'cap-g', player: 'player1', type: 'guard' },
  });
  return { ...base, cells, capturedPieces: [coord], currentPlayer: 'player1' };
}

describe('Wave 42 queens — restoreCapturedPiece success clear and flip', () => {
  it('restores piece to empty outer cell and clears capturedPieces', () => {
    const captured: BoardCoord = { ring: 2, position: 4 };
    const state = withCapturedPiece(captured);
    const outer = CONFIG.NUM_RINGS - 1;
    const target = { ring: outer, position: emptyOuterPos(state) };

    const next = restoreCapturedPiece(state, captured, target);
    expect(next).not.toBe(state);
    expect(next.cells.get(cellKey(captured.ring, captured.position))?.piece).toBeNull();
    expect(next.cells.get(cellKey(target.ring, target.position))?.piece?.type).toBe(
      'guard'
    );
    expect(next.capturedPieces).toEqual([]);
  });

  it('flips currentPlayer when captured list becomes empty', () => {
    const captured: BoardCoord = { ring: 3, position: 2 };
    const state = withCapturedPiece(captured);
    const outer = CONFIG.NUM_RINGS - 1;
    const target = { ring: outer, position: emptyOuterPos(state) };

    const next = restoreCapturedPiece(state, captured, target);
    expect(next.capturedPieces).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
  });

  it('keeps currentPlayer when other captures remain', () => {
    const a: BoardCoord = { ring: 2, position: 0 };
    const b: BoardCoord = { ring: 2, position: 1 };
    let state = withCapturedPiece(a);
    state = {
      ...state,
      cells: new Map(state.cells).set(cellKey(b.ring, b.position), {
        ...state.cells.get(cellKey(b.ring, b.position))!,
        piece: { id: 'cap-b', player: 'player1', type: 'guard' },
      }),
      capturedPieces: [a, b],
    };
    const outer = CONFIG.NUM_RINGS - 1;
    const target = { ring: outer, position: emptyOuterPos(state) };
    const next = restoreCapturedPiece(state, a, target);
    expect(next.capturedPieces).toEqual([b]);
    expect(next.currentPlayer).toBe('player1');
  });
});
