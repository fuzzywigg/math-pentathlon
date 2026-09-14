/**
 * Wave 46 — Kwatro selectChip with zero moves leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip } from '../../src/games/kwatro-sinko/rules';
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

describe('Wave 46 kwatro — select no moves', () => {
  it('select identity when all neighbors occupied', () => {
    let state = createInitialState();
    // Isolate p1-0 at n0-0; n1-0 and n0-1 already have chips at opening...
    // n0-0 neighbors: n0-1 (p1-1) and n1-0 empty — fill n1-0
    state = place(state, 'p2-0', 'n1-0');
    expect(selectChip(state, 'p1-0')).toBe(state);
  });
});
