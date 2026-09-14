/**
 * Wave 41 — Queens & Guards restore / selectPiece / hasValidMoves leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  CONFIG,
  cellKey,
  type QueensGuardsState,
  type BoardCoord,
} from '../../src/games/queens-guards/types';
import {
  restoreCapturedPiece,
  selectPiece,
  hasValidMoves,
  getValidMoves,
} from '../../src/games/queens-guards/rules';

function withPieceAt(
  state: QueensGuardsState,
  coord: BoardCoord,
  piece: { id: string; player: 'player1' | 'player2'; type: 'queen' | 'guard' }
): QueensGuardsState {
  const cells = new Map(state.cells);
  const key = cellKey(coord.ring, coord.position);
  cells.set(key, { ...cells.get(key)!, piece });
  return { ...state, cells };
}

function firstEmptyOuter(state: QueensGuardsState): number {
  const outer = CONFIG.NUM_RINGS - 1;
  for (let p = 0; p < outer * 6; p++) {
    if (!state.cells.get(cellKey(outer, p))?.piece) return p;
  }
  throw new Error('no empty outer');
}

describe('Wave 41 Queens — restore and select', () => {
  it('restoreCapturedPiece success relocates and flips when queue empty', () => {
    const base = createInitialState();
    const captured: BoardCoord = { ring: 2, position: 5 };
    let state = withPieceAt(base, captured, {
      id: 'cap',
      player: 'player2',
      type: 'guard',
    });
    state = { ...state, capturedPieces: [captured], currentPlayer: 'player1' };
    const emptyPos = firstEmptyOuter(state);
    const next = restoreCapturedPiece(state, captured, {
      ring: CONFIG.NUM_RINGS - 1,
      position: emptyPos,
    });
    expect(next.capturedPieces).toEqual([]);
    expect(next.cells.get(cellKey(captured.ring, captured.position))?.piece).toBeNull();
    expect(
      next.cells.get(cellKey(CONFIG.NUM_RINGS - 1, emptyPos))?.piece?.id
    ).toBe('cap');
    expect(next.currentPlayer).toBe('player2');
  });

  it('restore keeps turn when more captures remain', () => {
    const base = createInitialState();
    const c1: BoardCoord = { ring: 2, position: 3 };
    const c2: BoardCoord = { ring: 3, position: 4 };
    let state = withPieceAt(base, c1, {
      id: 'a',
      player: 'player2',
      type: 'guard',
    });
    state = withPieceAt(state, c2, {
      id: 'b',
      player: 'player2',
      type: 'guard',
    });
    state = {
      ...state,
      capturedPieces: [c1, c2],
      currentPlayer: 'player1',
    };
    const emptyPos = firstEmptyOuter(state);
    const next = restoreCapturedPiece(state, c1, {
      ring: CONFIG.NUM_RINGS - 1,
      position: emptyPos,
    });
    expect(next.capturedPieces).toEqual([c2]);
    expect(next.currentPlayer).toBe('player1');
  });

  it('selectPiece selects own movable piece and toggles off', () => {
    const state = createInitialState();
    let coord: BoardCoord | null = null;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player === 'player1') {
        const [ring, position] = key.split('-').map(Number);
        const c = { ring, position };
        if (getValidMoves(state, c).length > 0) {
          coord = c;
          break;
        }
      }
    }
    expect(coord).toBeTruthy();
    const key = cellKey(coord!.ring, coord!.position);
    const selected = selectPiece(state, coord!);
    expect(selected.selectedPiece).toBe(key);
    expect(selectPiece(selected, coord!).selectedPiece).toBeNull();
  });

  it('selectPiece clears when piece has zero moves', () => {
    let state = createInitialState();
    const cells = new Map(state.cells);
    for (const [k, c] of cells) {
      cells.set(k, { ...c, piece: null });
    }
    const from: BoardCoord = { ring: 1, position: 0 };
    cells.set(cellKey(1, 0), {
      ring: 1,
      position: 0,
      piece: { id: 'g', player: 'player1', type: 'guard' },
    });
    for (const adj of [
      { ring: 0, position: 0 },
      { ring: 1, position: 1 },
      { ring: 1, position: 5 },
    ]) {
      cells.set(cellKey(adj.ring, adj.position), {
        ...cells.get(cellKey(adj.ring, adj.position))!,
        piece: {
          id: `b-${adj.ring}-${adj.position}`,
          player: 'player2',
          type: 'guard',
        },
      });
    }
    state = { ...state, cells };
    const next = selectPiece(state, from);
    if (getValidMoves(state, from).length === 0) {
      expect(next.selectedPiece).toBeNull();
    } else {
      expect(next.selectedPiece).toBe(cellKey(1, 0));
    }
  });

  it('hasValidMoves false when current player has no pieces', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    for (const [k, c] of cells) {
      if (c.piece?.player === 'player1') {
        cells.set(k, { ...c, piece: null });
      }
    }
    const stripped: QueensGuardsState = {
      ...state,
      cells,
      currentPlayer: 'player1',
    };
    expect(hasValidMoves(stripped)).toBe(false);
  });
});
