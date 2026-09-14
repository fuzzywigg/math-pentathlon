/**
 * Wave 42 — FIAR getValidMoves empty in placement; nonempty after full place. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getValidMoves, placeChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 42 fiar — valid moves phase gate', () => {
  it('placement phase: getValidMoves is empty for every node', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    for (const id of state.board.nodes.keys()) {
      expect(getValidMoves(state, id)).toEqual([]);
    }
  });

  it('after full place, current player has at least one chip with moves', () => {
    const state = toMovement();
    expect(state.phase).toBe('movement');
    let found = false;
    for (const [id, node] of state.board.nodes) {
      if (node.chip !== state.currentPlayer) continue;
      if (getValidMoves(state, id).length > 0) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('mid-placement still yields empty valid moves', () => {
    let state = placeChip(createInitialState(), '2-2');
    expect(state.phase).toBe('placement');
    expect(getValidMoves(state, '2-2')).toEqual([]);
  });
});
