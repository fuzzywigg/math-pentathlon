/**
 * Wave 42 — Queens & Guards makeMove capture keeps seat leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { makeMove, getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

function ring1CaptureSetup(): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const [key, cell] of cells) {
    cells.set(key, { ...cell, piece: null });
  }
  cells.set(cellKey(1, 0), {
    ...cells.get(cellKey(1, 0))!,
    piece: { id: 'f0', player: 'player1', type: 'guard' },
  });
  cells.set(cellKey(1, 1), {
    ...cells.get(cellKey(1, 1))!,
    piece: { id: 'e1', player: 'player2', type: 'guard' },
  });
  cells.set(cellKey(1, 3), {
    ...cells.get(cellKey(1, 3))!,
    piece: { id: 'f3', player: 'player1', type: 'guard' },
  });
  return { ...base, cells, currentPlayer: 'player1' };
}

describe('Wave 42 queens — makeMove capture keeps currentPlayer', () => {
  it('ring1 sideways capture sandwiches opponent between two friendly guards', () => {
    const state = ring1CaptureSetup();
    const from = { ring: 1, position: 3 };
    const to = { ring: 1, position: 2 };
    expect(
      getValidMoves(state, from).some(
        (m) => m.ring === to.ring && m.position === to.position
      )
    ).toBe(true);

    const next = makeMove(state, from, to);
    expect(next).not.toBe(state);
    expect(next.capturedPieces).toEqual([{ ring: 1, position: 1 }]);
    expect(next.currentPlayer).toBe('player1');
    expect(next.moveHistory.at(-1)?.wasCapture).toBe(true);
  });

  it('capture move appends captured coord and leaves opponent piece marked in list', () => {
    const state = ring1CaptureSetup();
    const from = { ring: 1, position: 3 };
    const to = { ring: 1, position: 2 };
    const next = makeMove(state, from, to);
    expect(next.capturedPieces[0]).toEqual({ ring: 1, position: 1 });
    expect(next.moveHistory.at(-1)?.wasCapture).toBe(true);
    expect(next.currentPlayer).toBe('player1');
  });
});
