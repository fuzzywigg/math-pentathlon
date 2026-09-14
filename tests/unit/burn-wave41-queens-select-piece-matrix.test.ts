/**
 * Wave 41 — Queens & Guards selectPiece own/opp/empty/toggle matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  selectPiece,
  getValidMoves,
} from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  parseKey,
} from '../../src/games/queens-guards/types';

describe('Wave 41 queens — selectPiece matrix', () => {
  it('empty cell clears selection', () => {
    const state = {
      ...createInitialState(),
      selectedPiece: '3-0',
    };
    const next = selectPiece(state, { ring: 0, position: 0 });
    expect(next.selectedPiece).toBeNull();
  });

  it('opponent piece clears selection', () => {
    const state = createInitialState();
    let opp = { ring: 0, position: 0 };
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player === 'player2') {
        opp = parseKey(key);
        break;
      }
    }
    const next = selectPiece(state, opp);
    expect(next.selectedPiece).toBeNull();
  });

  it('own movable piece selects; second click toggles off', () => {
    const state = createInitialState();
    let from = { ring: 0, position: 0 };
    let found = false;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player !== 'player1') continue;
      const coord = parseKey(key);
      if (getValidMoves(state, coord).length > 0) {
        from = coord;
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
    const key = cellKey(from.ring, from.position);
    const selected = selectPiece(state, from);
    expect(selected.selectedPiece).toBe(key);
    const toggled = selectPiece(selected, from);
    expect(toggled.selectedPiece).toBeNull();
  });

  it('own piece with zero valid moves clears selection', () => {
    const state = createInitialState();
    // Forge: surround a player1 piece so getValidMoves is empty
    let targetKey: string | null = null;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player === 'player1' && cell.piece.type === 'guard') {
        targetKey = key;
        break;
      }
    }
    expect(targetKey).toBeTruthy();
    const coord = parseKey(targetKey!);
    // Fill every adjacent empty with opponent so moves vanish / sandwich
    const cells = new Map(state.cells);
    for (const [key, cell] of cells) {
      if (!cell.piece && cell.ring !== 0) {
        cells.set(key, {
          ...cell,
          piece: { id: `fill-${key}`, player: 'player2', type: 'guard' },
        });
      }
    }
    const jammed = { ...state, cells, selectedPiece: 'ghost' };
    const next = selectPiece(jammed, coord);
    expect(next.selectedPiece).toBeNull();
  });
});
