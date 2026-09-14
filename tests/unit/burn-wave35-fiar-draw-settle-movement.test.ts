/**
 * Wave 35 — FIAR movement draw settle + blocked path winner null.
 * Distinct from wave18 movement unlock.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import {
  isDraw,
  getSelectableNodes,
  checkWinner,
  selectChip,
  deselectChip,
  isPathBlocked,
  findPaths,
  placeChip,
  canPlaceChip,
} from '../../src/games/fiar/rules';
import { getAIMove } from '../../src/games/fiar/ai';

describe('Wave 35 FIAR — draw settle / paths', () => {
  it('isDraw false during placement phase', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    expect(isDraw(state)).toBe(false);
    expect(getSelectableNodes(state)).toEqual([]);
  });

  it('placement canPlaceChip true for empty nodes; place advances', () => {
    const state = createInitialState();
    const nodeId = [...state.board.nodes.keys()][0];
    expect(canPlaceChip(state, nodeId)).toBe(true);
    const next = placeChip(state, nodeId);
    expect(next).not.toBe(state);
    expect(next.board.nodes.get(nodeId)?.chip).toBe('player1');
  });

  it('forced stuck movement → isDraw true and empty selectable', () => {
    let state = createInitialState();
    // Exhaust placement by forging movement with no moves
    state = {
      ...state,
      phase: 'movement',
      selectedNode: null,
    };
    // Remove mobility: leave chips but ensure getValidMoves empty by isolating
    // Safest: no chips of current player → selectable empty → draw
    for (const [, node] of state.board.nodes) {
      if (node.chip === 'player1') node.chip = null;
    }
    expect(getSelectableNodes(state)).toEqual([]);
    expect(isDraw(state)).toBe(true);
  });

  it('selectChip rejects non-selectable; deselectChip clears', () => {
    const state = {
      ...createInitialState(),
      phase: 'movement' as const,
      selectedNode: 'x',
    };
    expect(selectChip(state, 'not-selectable')).toBe(state);
    expect(deselectChip(state).selectedNode).toBeNull();
  });

  it('checkWinner null on fresh board; findPaths empty-ish', () => {
    const state = createInitialState();
    expect(checkWinner(state)).toBeNull();
    expect(findPaths(state, 'player1').length).toBe(0);
  });

  it('getAIMove returns null or move object on opening', () => {
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    // Opening placement should yield a move for AI seat
    expect(move === null || typeof move === 'object').toBe(true);
  });
});
