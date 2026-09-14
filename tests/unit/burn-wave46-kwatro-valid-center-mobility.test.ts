/**
 * Wave 46 — Kwatro center chip mobility leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

function place(state: KwaState, chipId: string, nodeId: string): KwaState {
  const chip = state.chips.get(chipId)!;
  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);
  if (chip.position) {
    const old = nodes.get(chip.position);
    if (old) nodes.set(chip.position, { ...old, chip: null });
  }
  const updated: Chip = { ...chip, position: nodeId };
  chips.set(chipId, updated);
  const node = nodes.get(nodeId);
  if (node) nodes.set(nodeId, { ...node, chip: updated });
  return { ...state, nodes, chips };
}

describe('Wave 46 kwatro — center mobility', () => {
  it('chip on n2-2 has multiple empty connections', () => {
    const state = place(createInitialState(), 'p1-2', 'n2-2');
    const moves = getValidMoves(state, 'p1-2');
    expect(moves.length).toBeGreaterThan(3);
  });
});
