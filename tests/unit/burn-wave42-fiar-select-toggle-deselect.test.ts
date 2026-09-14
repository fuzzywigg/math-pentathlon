/**
 * Wave 42 — FIAR selectChip toggle and deselectChip. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  selectChip,
  deselectChip,
  getSelectableNodes,
  placeChip,
} from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 42 fiar — select toggle deselect', () => {
  it('selectChip sets selectedNode then toggles off on second select', () => {
    const state = toMovement();
    const id = getSelectableNodes(state)[0];
    const selected = selectChip(state, id);
    expect(selected.selectedNode).toBe(id);
    const toggled = selectChip(selected, id);
    expect(toggled.selectedNode).toBeNull();
  });

  it('deselectChip clears selectedNode without other mutations', () => {
    const state = toMovement();
    const id = getSelectableNodes(state)[0];
    const selected = selectChip(state, id);
    const cleared = deselectChip(selected);
    expect(cleared.selectedNode).toBeNull();
    expect(cleared.currentPlayer).toBe(selected.currentPlayer);
    expect(cleared.phase).toBe(selected.phase);
  });

  it('deselectChip on already-null selectedNode stays null', () => {
    const state = toMovement();
    expect(state.selectedNode).toBeNull();
    expect(deselectChip(state).selectedNode).toBeNull();
  });
});
