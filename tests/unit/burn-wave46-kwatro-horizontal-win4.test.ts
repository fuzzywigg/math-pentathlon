/**
 * Wave 46 — Kwatro horizontal alignment win-4 leftover (vs wave45 vertical). Tests-only.
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

describe('Wave 46 kwatro — horizontal win 4', () => {
  it('forged horizontal 0+6-2=4 wins via moveChip', () => {
    let state = createInitialState();
    state = place(state, 'p1-0', 'n2-0'); // 0
    state = place(state, 'p1-3', 'n2-1'); // 6
    state = place(state, 'p1-1', 'n1-2'); // 2 → n2-2
    const result = moveChip(selectChip(state, 'p1-1'), 'n2-2');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.winningAlignment?.result).toBe(4);
  });
});
