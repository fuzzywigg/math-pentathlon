/**
 * Wave 42 — Queens & Guards hasValidMoves jammed leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { hasValidMoves } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  parseKey,
} from '../../src/games/queens-guards/types';

describe('Wave 42 queens — hasValidMoves true / false jammed', () => {
  it('opening position has valid moves for player1', () => {
    expect(hasValidMoves(createInitialState())).toBe(true);
  });

  it('fully blocked board yields false for current player', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    for (const [key, cell] of cells) {
      if (!cell.piece && cell.ring !== 0) {
        cells.set(key, {
          ...cell,
          piece: { id: `fill-${key}`, player: 'player2', type: 'guard' },
        });
      }
    }
    expect(hasValidMoves({ ...state, cells })).toBe(false);
  });

  it('player2 seated with all own pieces blocked returns false', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    for (const [key, cell] of cells) {
      if (!cell.piece && cell.ring !== 0) {
        cells.set(key, {
          ...cell,
          piece: { id: `fill-${key}`, player: 'player1', type: 'guard' },
        });
      }
    }
    expect(
      hasValidMoves({ ...state, cells, currentPlayer: 'player2' })
    ).toBe(false);
  });

  it('single movable own piece keeps hasValidMoves true', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    for (const [key, cell] of cells) {
      if (cell.piece?.player === 'player1') {
        cells.set(key, { ...cell, piece: null });
      }
    }
    cells.set(cellKey(5, 1), {
      ...cells.get(cellKey(5, 1))!,
      piece: { id: 'solo', player: 'player1', type: 'guard' },
    });
    const trimmed = { ...state, cells };
    expect(hasValidMoves(trimmed)).toBe(true);
    const soloCoord = parseKey(cellKey(5, 1));
    expect(trimmed.cells.get(cellKey(soloCoord.ring, soloCoord.position))?.piece).toBeTruthy();
  });
});
