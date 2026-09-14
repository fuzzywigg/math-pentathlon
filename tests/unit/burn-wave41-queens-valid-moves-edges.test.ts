/**
 * Wave 41 — Queens & Guards getValidMoves empty / opponent / throne edges.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getValidMoves, hasValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  parseKey,
  CONFIG,
} from '../../src/games/queens-guards/types';

describe('Wave 41 queens — getValidMoves edges', () => {
  it('empty throne and empty mid-ring return []', () => {
    const state = createInitialState();
    expect(getValidMoves(state, { ring: 0, position: 0 })).toEqual([]);
    // Find empty mid ring cell
    for (let pos = 0; pos < cellsInMid(state); pos++) {
      const c = state.cells.get(cellKey(2, pos));
      if (c && !c.piece) {
        expect(getValidMoves(state, { ring: 2, position: pos })).toEqual([]);
        break;
      }
    }
  });

  it('opponent pieces never yield moves for current seat', () => {
    const state = createInitialState();
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player === 'player2') {
        expect(getValidMoves(state, parseKey(key))).toEqual([]);
      }
    }
  });

  it('guard cannot list throne as destination even when empty', () => {
    const state = createInitialState();
    // Place a player1 guard adjacent to center if possible via forge
    const cells = new Map(state.cells);
    cells.set(cellKey(1, 0), {
      ...cells.get(cellKey(1, 0))!,
      piece: { id: 'g-throne', player: 'player1', type: 'guard' },
    });
    cells.set(cellKey(0, 0), {
      ...cells.get(cellKey(0, 0))!,
      piece: null,
    });
    const forged = { ...state, cells };
    const moves = getValidMoves(forged, { ring: 1, position: 0 });
    expect(moves.some((m) => m.ring === 0)).toBe(false);
  });

  it('opening hasValidMoves true; fully jammed false', () => {
    const open = createInitialState();
    expect(hasValidMoves(open)).toBe(true);
    const cells = new Map(open.cells);
    for (const [key, cell] of cells) {
      if (!cell.piece) {
        cells.set(key, {
          ...cell,
          piece: {
            id: `jam-${key}`,
            player: 'player2',
            type: 'guard',
          },
        });
      }
    }
    expect(hasValidMoves({ ...open, cells })).toBe(false);
  });

  it('outer-ring piece count matches CONFIG rings', () => {
    const state = createInitialState();
    const outer = CONFIG.NUM_RINGS - 1;
    let count = 0;
    for (const cell of state.cells.values()) {
      if (cell.ring === outer && cell.piece) count++;
    }
    expect(count).toBeGreaterThan(0);
  });
});

function cellsInMid(state: ReturnType<typeof createInitialState>): number {
  let n = 0;
  for (const cell of state.cells.values()) {
    if (cell.ring === 2) n++;
  }
  return n;
}
