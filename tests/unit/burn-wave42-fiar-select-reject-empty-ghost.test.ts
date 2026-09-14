/**
 * Wave 42 — FIAR selectChip rejects opponent / empty / ghost nodes. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { selectChip, placeChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 42 fiar — select reject empty ghost', () => {
  it('selectChip on empty node is identity', () => {
    const state = toMovement();
    let empty = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip === null) {
        empty = id;
        break;
      }
    }
    expect(empty).toBeTruthy();
    expect(selectChip(state, empty)).toBe(state);
  });

  it('selectChip on ghost id is identity', () => {
    const state = toMovement();
    expect(selectChip(state, 'ghost-9-9')).toBe(state);
    expect(selectChip(state, '99-99')).toBe(state);
  });

  it('selectChip on opponent chip is identity', () => {
    const state = toMovement();
    let opp = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip && node.chip !== state.currentPlayer) {
        opp = id;
        break;
      }
    }
    expect(opp).toBeTruthy();
    expect(selectChip(state, opp)).toBe(state);
  });
});
