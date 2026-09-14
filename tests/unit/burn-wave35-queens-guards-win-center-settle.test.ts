/**
 * Wave 35 — Queens & Guards center+guards win settle + selectPiece clears.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
} from '../../src/games/queens-guards/types';
import {
  checkWinner,
  selectPiece,
  hasValidMoves,
  getValidMoves,
  makeMove,
} from '../../src/games/queens-guards/rules';
import { getAIMove } from '../../src/games/queens-guards/ai';

describe('Wave 35 Queens & Guards — win center settle', () => {
  it('incomplete center surround → checkWinner null', () => {
    expect(checkWinner(createInitialState())).toBeNull();
  });

  it('queen at center with 6 own guards on ring1 → winner', () => {
    const state = createInitialState();
    const center = state.cells.get(cellKey(0, 0))!;
    center.piece = {
      id: 'q1',
      player: 'player1',
      type: 'queen',
    };
    for (let pos = 0; pos < 6; pos++) {
      const cell = state.cells.get(cellKey(1, pos))!;
      cell.piece = {
        id: `g${pos}`,
        player: 'player1',
        type: 'guard',
      };
    }
    expect(checkWinner(state)).toBe('player1');
  });

  it('queen center but missing one guard → null', () => {
    const state = createInitialState();
    state.cells.get(cellKey(0, 0))!.piece = {
      id: 'q1',
      player: 'player2',
      type: 'queen',
    };
    for (let pos = 0; pos < 5; pos++) {
      state.cells.get(cellKey(1, pos))!.piece = {
        id: `g${pos}`,
        player: 'player2',
        type: 'guard',
      };
    }
    expect(checkWinner(state)).toBeNull();
  });

  it('selectPiece on opponent piece clears selection', () => {
    const state = createInitialState();
    // Find an opponent piece cell
    let oppKey: string | null = null;
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player === 'player2') {
        oppKey = key;
        break;
      }
    }
    expect(oppKey).toBeTruthy();
    const next = selectPiece(state, oppKey!);
    expect(next.selectedPiece).toBeNull();
  });

  it('getValidMoves empty for empty cell; makeMove identity illegal', () => {
    const state = createInitialState();
    expect(getValidMoves(state, { ring: 0, position: 0 })).toEqual([]);
    expect(
      makeMove(state, { ring: 5, position: 0 }, { ring: 0, position: 0 })
    ).toBe(state);
  });

  it('opening hasValidMoves; AI null when winner set', () => {
    expect(hasValidMoves(createInitialState())).toBe(true);
    const over = { ...createInitialState(), winner: 'player1' as const };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
  });
});
