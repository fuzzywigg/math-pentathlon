/**
 * Wave 42 — Queens & Guards selectPiece ownership leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { selectPiece, getValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  parseKey,
} from '../../src/games/queens-guards/types';

describe('Wave 42 queens — selectPiece own vs empty vs opponent', () => {
  it('selecting empty cell clears selection', () => {
    const state = { ...createInitialState(), selectedPiece: '5-7' };
    const next = selectPiece(state, { ring: 2, position: 0 });
    expect(next.selectedPiece).toBeNull();
  });

  it('selecting opponent piece clears selection', () => {
    const state = createInitialState();
    const outer = 5;
    const next = selectPiece(state, { ring: outer, position: 22 });
    expect(next.selectedPiece).toBeNull();
  });

  it('selecting own movable piece sets selectedPiece key', () => {
    const state = createInitialState();
    const coord = { ring: 5, position: 1 };
    expect(getValidMoves(state, coord).length).toBeGreaterThan(0);
    const next = selectPiece(state, coord);
    expect(next.selectedPiece).toBe(cellKey(coord.ring, coord.position));
  });

  it('own piece with no valid moves clears selection', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    let targetKey: string | null = null;
    for (const [key, cell] of cells) {
      if (cell.piece?.player === 'player1' && cell.piece.type === 'guard') {
        targetKey = key;
        break;
      }
    }
    expect(targetKey).toBeTruthy();
    for (const [key, cell] of cells) {
      if (!cell.piece) {
        cells.set(key, {
          ...cell,
          piece: { id: `block-${key}`, player: 'player2', type: 'guard' },
        });
      }
    }
    const jammed = { ...state, cells, selectedPiece: '5-1' };
    const coord = parseKey(targetKey!);
    const next = selectPiece(jammed, coord);
    expect(next.selectedPiece).toBeNull();
  });
});
