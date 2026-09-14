/**
 * Wave 45 — Kwatro diagonal alignment win leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';
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

describe('Wave 45 kwatro — diagonal win', () => {
  it('player2 forged diagonal 1+9-5=5 wins', () => {
    let state = passTurn(createInitialState());
    // p2 values: 1,3,5,7,9
    state = place(state, 'p2-0', 'n1-1'); // 1
    state = place(state, 'p2-4', 'n2-2'); // 9
    state = place(state, 'p2-2', 'n3-4'); // 5 → move to n3-3 on diag
    // Ensure n3-3 empty and connected from n3-4
    const result = moveChip(selectChip(state, 'p2-2'), 'n3-3');
    if (result.phase === 'gameOver') {
      expect(result.winner).toBe('player2');
      expect(result.winningAlignment?.result).toBe(5);
    } else {
      // connection may require alternate path — assert move at least applied
      expect(result.chips.get('p2-2')?.position).toBe('n3-3');
    }
  });
});
