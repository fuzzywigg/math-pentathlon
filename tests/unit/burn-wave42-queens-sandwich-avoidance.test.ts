/**
 * Wave 42 — Queens & Guards wouldBeSandwiched move filter leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

function clearBoard(): QueensGuardsState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const [key, cell] of cells) {
    cells.set(key, { ...cell, piece: null });
  }
  return { ...base, cells };
}

describe('Wave 42 queens — sandwich avoidance filters moves', () => {
  it('moving into ring1 slot between two opponents is not offered', () => {
    const state = clearBoard();
    state.cells.set(cellKey(1, 0), {
      ...state.cells.get(cellKey(1, 0))!,
      piece: { id: 'o0', player: 'player2', type: 'guard' },
    });
    state.cells.set(cellKey(1, 2), {
      ...state.cells.get(cellKey(1, 2))!,
      piece: { id: 'o2', player: 'player2', type: 'guard' },
    });
    state.cells.set(cellKey(1, 1), {
      ...state.cells.get(cellKey(1, 1))!,
      piece: null,
    });
    state.cells.set(cellKey(1, 3), {
      ...state.cells.get(cellKey(1, 3))!,
      piece: { id: 'f3', player: 'player1', type: 'guard' },
    });

    const moves = getValidMoves(state, { ring: 1, position: 3 });
    expect(moves.some((m) => m.ring === 1 && m.position === 1)).toBe(false);
    expect(moves.length).toBeGreaterThan(0);
  });

  it('safe ring1 slot with only one flanking opponent remains reachable', () => {
    const state = clearBoard();
    state.cells.set(cellKey(1, 0), {
      ...state.cells.get(cellKey(1, 0))!,
      piece: { id: 'f0', player: 'player1', type: 'guard' },
    });
    state.cells.set(cellKey(1, 2), {
      ...state.cells.get(cellKey(1, 2))!,
      piece: { id: 'o2', player: 'player2', type: 'guard' },
    });

    const moves = getValidMoves(state, { ring: 1, position: 0 });
    expect(moves.some((m) => m.ring === 1 && m.position === 1)).toBe(true);
  });
});
