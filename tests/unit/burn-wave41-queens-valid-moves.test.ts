/**
 * Wave 41 — Queens & Guards getValidMoves queen/guard leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
  createBoard,
  type QueensGuardsState,
  type BoardCoord,
} from '../../src/games/queens-guards/types';
import { getValidMoves, hasValidMoves } from '../../src/games/queens-guards/rules';

function clearBoard(state: QueensGuardsState): QueensGuardsState {
  const cells = new Map(state.cells);
  for (const [k, c] of cells) {
    cells.set(k, { ...c, piece: null });
  }
  return { ...state, cells };
}

function place(
  state: QueensGuardsState,
  coord: BoardCoord,
  piece: { id: string; player: 'player1' | 'player2'; type: 'queen' | 'guard' }
): QueensGuardsState {
  const cells = new Map(state.cells);
  const key = cellKey(coord.ring, coord.position);
  cells.set(key, { ...cells.get(key)!, piece });
  return { ...state, cells };
}

function cellsInRingSafe(ring: number): number {
  return ring === 0 ? 1 : 6 * ring;
}

describe('Wave 41 Queens — valid moves', () => {
  it('guard on outer ring can move sideways or inward, never outward', () => {
    let state = clearBoard(createInitialState());
    const from: BoardCoord = { ring: 5, position: 0 };
    state = place(state, from, {
      id: 'g1',
      player: 'player1',
      type: 'guard',
    });
    const moves = getValidMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);
    expect(moves.every((m) => m.ring <= from.ring)).toBe(true);
    expect(moves.every((m) => m.ring !== 0)).toBe(true);
  });

  it('queen can move onto center when adjacent and empty', () => {
    let state = clearBoard(createInitialState());
    const from: BoardCoord = { ring: 1, position: 0 };
    state = place(state, from, {
      id: 'q1',
      player: 'player1',
      type: 'queen',
    });
    const moves = getValidMoves(state, from);
    expect(moves.some((m) => m.ring === 0 && m.position === 0)).toBe(true);
  });

  it('occupied same-ring neighbor is excluded from valid moves', () => {
    let state = clearBoard(createInitialState());
    const from: BoardCoord = { ring: 3, position: 0 };
    state = place(state, from, {
      id: 'g1',
      player: 'player1',
      type: 'guard',
    });
    state = place(state, { ring: 3, position: 1 }, {
      id: 'b1',
      player: 'player2',
      type: 'guard',
    });
    state = place(state, { ring: 3, position: cellsInRingSafe(3) - 1 }, {
      id: 'b2',
      player: 'player2',
      type: 'guard',
    });
    const after = getValidMoves(state, from);
    expect(after.some((m) => m.ring === 3 && m.position === 1)).toBe(false);
  });

  it('opponent piece yields empty valid moves', () => {
    const state = createInitialState();
    let opp: BoardCoord | null = null;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player === 'player2') {
        const [ring, position] = key.split('-').map(Number);
        opp = { ring, position };
        break;
      }
    }
    expect(opp).toBeTruthy();
    expect(getValidMoves(state, opp!)).toEqual([]);
  });

  it('empty cell returns empty moves; opening board hasValidMoves', () => {
    const state = createInitialState();
    expect(getValidMoves(state, { ring: 0, position: 0 })).toEqual([]);
    expect(hasValidMoves(state)).toBe(true);
    expect(createBoard().size).toBeGreaterThan(30);
  });
});
