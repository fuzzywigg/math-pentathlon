/**
 * Wave 46 — Kwatro horizontal alignment win-4 leftover (vs wave45 vertical).
 * Updated for #375: win requires all chips off numbered spaces + mixed-color like+like−opposite.
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
  it('forged horizontal 1+9-6=4 wins via moveChip', () => {
    let state = createInitialState();
    state = { ...state, currentPlayer: 'player2' };
    state = place(state, 'p2-4', 'n2-0'); // 9
    state = place(state, 'p1-3', 'n2-1'); // 6
    state = place(state, 'p2-0', 'n1-2'); // 1 → n2-2
    state = place(state, 'p2-1', 'n1-0');
    state = place(state, 'p2-2', 'n1-1');
    state = place(state, 'p2-3', 'n1-3');
    const result = moveChip(selectChip(state, 'p2-0'), 'n2-2');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player2');
    expect(result.winningAlignment?.result).toBe(4);
  });
});
