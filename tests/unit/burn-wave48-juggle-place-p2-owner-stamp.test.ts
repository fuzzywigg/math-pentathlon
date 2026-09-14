/**
 * Wave 48 — Juggle placeShape stamps P2 move + occupied cells. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  selectDie,
  selectShape,
  placeShape,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — P2 owner stamp', () => {
  it('places with P2 history and occupied cells on P2 board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    state = { ...state, currentPlayer: 'player2' };
    state = doRollDice(state);
    state = selectDie(state, 0);
    if (state.phase !== 'placing') {
      state = selectShape(state, getShapesForDie(state.currentDice![0])[0]);
    }
    const next = placeShape(state, { row: 0, col: 0 });
    expect(next).not.toBe(state);
    expect(next.moveHistory[0].player).toBe('player2');
    expect(next.moveHistory[0].chosenDie).toBe(state.currentDice![0]);
    expect(next.boards.player2.cells.flat().some(Boolean)).toBe(true);
    expect(next.boards.player2.placements.length).toBeGreaterThan(0);
  });
});
