/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko forged alignment win with result 4 via moveChip. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

function placeChip(state: KwaState, chipId: string, nodeId: string): KwaState {
  const chip = state.chips.get(chipId);
  if (!chip) throw new Error(`missing chip ${chipId}`);

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

/** 6 - 2 + 0 = 4 along row 2; mover adjacent at n1-2 */
function forgeFourWinSetup(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-3', 'n2-0'); // value 6
  state = placeChip(state, 'p1-1', 'n2-1'); // value 2
  state = placeChip(state, 'p1-0', 'n1-2'); // value 0 → n2-2
  return state;
}

describe('Wave 47 kwatro deepen 16 — kwatro-sinko — alignment win four', () => {
  it('moveChip completes horizontal line and sets winner player1', () => {
    const state = forgeFourWinSetup();
    const selected = selectChip(state, 'p1-0');
    const result = moveChip(selected, 'n2-2');

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.currentPlayer).toBe('player1');
  });

  it('winning alignment expression evaluates to 4', () => {
    const state = forgeFourWinSetup();
    const result = moveChip(selectChip(state, 'p1-0'), 'n2-2');

    expect(result.winningAlignment).not.toBeNull();
    expect(result.winningAlignment?.result).toBe(4);
    expect(result.winningAlignment?.expression).toContain('= 4');
    expect(result.winningAlignment?.nodes).toHaveLength(3);
  });

  it('move history records alignment on the winning move', () => {
    const state = forgeFourWinSetup();
    const result = moveChip(selectChip(state, 'p1-0'), 'n2-2');

    expect(result.moveHistory).toHaveLength(1);
    expect(result.moveHistory[0].alignment?.result).toBe(4);
    expect(result.moveHistory[0].toNode).toBe('n2-2');
  });

  it('chip lands on forged node and clears selection', () => {
    const state = forgeFourWinSetup();
    const result = moveChip(selectChip(state, 'p1-0'), 'n2-2');

    expect(result.selectedChip).toBeNull();
    expect(result.nodes.get('n2-2')?.chip?.value).toBe(0);
    expect(result.nodes.get('n1-2')?.chip).toBeNull();
  });
});
