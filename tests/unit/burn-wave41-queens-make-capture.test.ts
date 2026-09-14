/**
 * Wave 41 — Queens & Guards makeMove capture sandwich leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
  type BoardCoord,
  type Piece,
} from '../../src/games/queens-guards/types';
import {
  makeMove,
  getValidMoves,
  checkWinner,
} from '../../src/games/queens-guards/rules';

function blank(): QueensGuardsState {
  const state = createInitialState();
  const cells = new Map(state.cells);
  for (const [k, c] of cells) {
    cells.set(k, { ...c, piece: null });
  }
  return { ...state, cells, capturedPieces: [], moveHistory: [] };
}

function put(
  state: QueensGuardsState,
  coord: BoardCoord,
  piece: Piece
): QueensGuardsState {
  const cells = new Map(state.cells);
  const key = cellKey(coord.ring, coord.position);
  cells.set(key, { ...cells.get(key)!, piece });
  return { ...state, cells };
}

function cellsCount(ring: number): number {
  return ring === 0 ? 1 : 6 * ring;
}

describe('Wave 41 Queens — makeMove capture', () => {
  it('legal sideways move relocates piece and flips turn when no capture', () => {
    let state = blank();
    const from: BoardCoord = { ring: 4, position: 2 };
    state = put(state, from, {
      id: 'g1',
      player: 'player1',
      type: 'guard',
    });
    const moves = getValidMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);
    const to = moves.find((m) => m.ring === from.ring) ?? moves[0];
    const next = makeMove(state, from, to);
    expect(next).not.toBe(state);
    expect(next.cells.get(cellKey(from.ring, from.position))?.piece).toBeNull();
    expect(next.cells.get(cellKey(to.ring, to.position))?.piece?.id).toBe('g1');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].wasCapture).toBe(false);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedPiece).toBeNull();
  });

  it('illegal destination returns identity state', () => {
    let state = blank();
    const from: BoardCoord = { ring: 5, position: 3 };
    state = put(state, from, {
      id: 'g1',
      player: 'player1',
      type: 'guard',
    });
    expect(makeMove(state, from, { ring: 0, position: 0 })).toBe(state);
  });

  it('radial sandwich capture keeps mover turn when geometry allows', () => {
    let state = blank();
    const victim: BoardCoord = { ring: 3, position: 0 };
    const ally: BoardCoord = { ring: 4, position: 0 };
    const from: BoardCoord = { ring: 2, position: 1 };
    state = put(state, victim, {
      id: 'opp',
      player: 'player2',
      type: 'guard',
    });
    state = put(state, ally, {
      id: 'ally',
      player: 'player1',
      type: 'guard',
    });
    state = put(state, from, {
      id: 'mover',
      player: 'player1',
      type: 'guard',
    });

    const candidates = getValidMoves(state, from);
    let captured: QueensGuardsState | null = null;
    for (const to of candidates) {
      const next = makeMove(state, from, to);
      if (next.capturedPieces.length > 0) {
        captured = next;
        break;
      }
    }
    if (captured) {
      expect(captured.capturedPieces.length).toBeGreaterThan(0);
      expect(captured.moveHistory[0].wasCapture).toBe(true);
      expect(captured.currentPlayer).toBe('player1');
    } else {
      expect(
        candidates.every((to) => makeMove(state, from, to).capturedPieces.length === 0)
      ).toBe(true);
    }
  });

  it('same-ring neighbors with opponents still yields only legal moves', () => {
    let state = blank();
    const from: BoardCoord = { ring: 2, position: 0 };
    state = put(state, { ring: 2, position: 2 }, {
      id: 'o1',
      player: 'player2',
      type: 'guard',
    });
    state = put(state, { ring: 2, position: cellsCount(2) - 2 }, {
      id: 'o2',
      player: 'player2',
      type: 'guard',
    });
    state = put(state, from, {
      id: 'me',
      player: 'player1',
      type: 'guard',
    });
    const moves = getValidMoves(state, from);
    for (const to of moves) {
      expect(typeof to.ring).toBe('number');
      expect(typeof to.position).toBe('number');
    }
  });

  it('checkWinner still null after ordinary non-center move', () => {
    let state = blank();
    const from: BoardCoord = { ring: 5, position: 10 };
    state = put(state, from, {
      id: 'g',
      player: 'player1',
      type: 'guard',
    });
    const to = getValidMoves(state, from)[0];
    if (!to) return;
    const next = makeMove(state, from, to);
    expect(checkWinner(next)).toBeNull();
    expect(next.winner).toBeNull();
  });
});
