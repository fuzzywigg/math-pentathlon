/**
 * Wave 40 — FIAR chips exhausted / placement getValidMoves / moveChip identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import {
  canPlaceChip,
  getValidMoves,
  moveChip,
  canMove,
  isDraw,
  getSelectableNodes,
} from '../../src/games/fiar/rules';

describe('Wave 40 fiar — chips exhausted phase', () => {
  it('canPlaceChip false when chipsPlaced >= CHIPS_PER_PLAYER (forge)', () => {
    const state = createInitialState();
    const nodeId = [...state.board.nodes.keys()][0];
    const forged = {
      ...state,
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: 0,
      },
    };
    expect(canPlaceChip(forged, nodeId)).toBe(false);
  });

  it('getValidMoves in placement phase → []', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    const nodeId = [...state.board.nodes.keys()][0];
    expect(getValidMoves(state, nodeId)).toEqual([]);
  });

  it('moveChip illegal / !canMove → identity', () => {
    const state = createInitialState();
    // Still placement — canMove is false for any pair
    expect(canMove(state, '0-0', '0-1')).toBe(false);
    expect(moveChip(state, '0-0', '0-1')).toBe(state);

    const movement = {
      ...state,
      phase: 'movement' as const,
    };
    // No chips placed → still illegal
    expect(moveChip(movement, '0-0', '0-1')).toBe(movement);
    expect(moveChip(movement, 'ghost-from', 'ghost-to')).toBe(movement);
  });

  it('isDraw true when movement with no selectable chips', () => {
    const state = {
      ...createInitialState(),
      phase: 'movement' as const,
    };
    expect(getSelectableNodes(state)).toEqual([]);
    expect(isDraw(state)).toBe(true);
    expect(isDraw(createInitialState())).toBe(false);
  });
});
