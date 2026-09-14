/**
 * Wave 41 — Queens & Guards restoreCapturedPiece success + remaining-list flip.
 * Distinct from wave39 reject matrix (adds multi-capture remaining). Tests-only.
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
  for (let p = 0; p < outer * 6; p++) {
    if (!state.cells.get(cellKey(outer, p))?.piece) return p;
  }
  return 0;
}

function withPieces(
  coords: BoardCoord[],
  captured: BoardCoord[]
): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const c of coords) {
    cells.set(cellKey(c.ring, c.position), {
      ...cells.get(cellKey(c.ring, c.position))!,
      piece: {
        id: `cap-${c.ring}-${c.position}`,
        player: 'player1',
        type: 'guard',
      },
    });
  }
  return { ...base, cells, capturedPieces: captured };
}

describe('Wave 41 queens — restore success edges', () => {
  it('restoring one of two captures keeps seat (remaining list)', () => {
    const a: BoardCoord = { ring: 2, position: 0 };
    const b: BoardCoord = { ring: 2, position: 1 };
    const state = withPieces([a, b], [a, b]);
    const outer = CONFIG.NUM_RINGS - 1;
    const target = { ring: outer, position: emptyOuterPos(state) };
    const next = restoreCapturedPiece(state, a, target);
    expect(next).not.toBe(state);
    expect(next.capturedPieces).toHaveLength(1);
    expect(next.capturedPieces[0]).toEqual(b);
    expect(next.currentPlayer).toBe(state.currentPlayer);
  });

  it('restoring last capture flips to opponent', () => {
    const a: BoardCoord = { ring: 2, position: 3 };
    const state = withPieces([a], [a]);
    const outer = CONFIG.NUM_RINGS - 1;
    const target = { ring: outer, position: emptyOuterPos(state) };
    const next = restoreCapturedPiece(state, a, target);
    expect(next.capturedPieces).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
  });

  it('wrong-ring reject still identity when multi-captured', () => {
    const a: BoardCoord = { ring: 2, position: 0 };
    const b: BoardCoord = { ring: 2, position: 2 };
    const state = withPieces([a, b], [a, b]);
    expect(
      restoreCapturedPiece(state, a, { ring: 1, position: 0 })
    ).toBe(state);
  });
});
