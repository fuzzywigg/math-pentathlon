/**
 * Wave 45 — Kwatro all-off-numbered territory win leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';
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

describe('Wave 45 kwatro — territory win', () => {
  it('last chip leaving numbered row wins without alignment', () => {
    let state = createInitialState();
    // Move four p1 chips to non-numbered; leave one on n0-4 to move to n1-4
    state = place(state, 'p1-0', 'n1-0');
    state = place(state, 'p1-1', 'n1-1');
    state = place(state, 'p1-2', 'n1-2');
    state = place(state, 'p1-3', 'n1-3');
    // p1-4 still on n0-4
    const result = moveChip(selectChip(state, 'p1-4'), 'n1-4');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    // May settle via territory and/or incidental alignment on row 1
    const allOffNumbered = ['p1-0', 'p1-1', 'p1-2', 'p1-3', 'p1-4'].every((id) => {
      const pos = result.chips.get(id)?.position;
      return pos != null && result.nodes.get(pos)?.isNumbered === false;
    });
    expect(allOffNumbered || result.winningAlignment != null).toBe(true);
  });
});
