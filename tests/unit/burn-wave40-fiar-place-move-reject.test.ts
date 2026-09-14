/**
 * Wave 40 — FIAR placeChip / moveChip / selectChip reject leftovers.
 * After #177 path-block; deepen place/move identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canPlaceChip,
  placeChip,
  moveChip,
  selectChip,
  getValidMoves,
  canMove,
  isDraw,
  checkWinner,
} from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';

describe('Wave 40 fiar — place/move rejects', () => {
  it('canPlaceChip false in movement; placeChip ghost identity', () => {
    const state = createInitialState();
    expect(placeChip(state, '__ghost__')).toBe(state);

    const movement = { ...state, phase: 'movement' as const };
    expect(canPlaceChip(movement, [...state.board.nodes.keys()][0])).toBe(
      false
    );
    expect(placeChip(movement, [...state.board.nodes.keys()][0])).toBe(
      movement
    );
  });

  it('successful place then reject re-place occupied', () => {
    const state = createInitialState();
    const nodeId = [...state.board.nodes.keys()][0];
    expect(canPlaceChip(state, nodeId)).toBe(true);
    const next = placeChip(state, nodeId);
    expect(next).not.toBe(state);
    expect(next.chipsPlaced.player1).toBe(1);
    // Same node now occupied for next player
    expect(placeChip(next, nodeId)).toBe(next);
  });

  it('moveChip / selectChip / getValidMoves reject outside movement', () => {
    const state = createInitialState();
    const nodeId = [...state.board.nodes.keys()][0];
    expect(getValidMoves(state, nodeId)).toEqual([]);
    expect(canMove(state, nodeId, nodeId)).toBe(false);
    expect(moveChip(state, nodeId, nodeId)).toBe(state);
    expect(selectChip(state, nodeId)).toBe(state);
    expect(isDraw(state)).toBe(false);
    expect(checkWinner(state)).toBeNull();
  });
});
