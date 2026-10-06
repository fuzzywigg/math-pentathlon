/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko forged alignment win with result 5 via moveChip.
 * Updated for #375: win requires all chips off numbered spaces + mixed-color like+like−opposite.
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

/** Blue: 6 + 2 − 3 = 5 along row 2; all Blue chips off numbered rows */
function forgeFiveWinSetup(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-3', 'n2-0'); // 6
  state = placeChip(state, 'p2-1', 'n2-1'); // 3
  state = placeChip(state, 'p1-1', 'n1-2'); // 2 → n2-2
  state = placeChip(state, 'p1-0', 'n1-0');
  state = placeChip(state, 'p1-2', 'n1-1');
  state = placeChip(state, 'p1-4', 'n1-3');
  return state;
}

describe('Wave 47 kwatro deepen 15 — kwatro-sinko — alignment win five', () => {
  it('player1 moveChip triggers gameOver with winner player1', () => {
    const state = forgeFiveWinSetup();
    const result = moveChip(selectChip(state, 'p1-1'), 'n2-2');

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
  });

  it('alignment result is 5 with three chips on the forged line', () => {
    const result = moveChip(selectChip(forgeFiveWinSetup(), 'p1-1'), 'n2-2');

    expect(result.winningAlignment?.result).toBe(5);
    expect(result.winningAlignment?.chips.map((c) => c.value).sort()).toEqual([
      2, 3, 6,
    ]);
  });

  it('winning move keeps player1 as currentPlayer when game ends', () => {
    const result = moveChip(selectChip(forgeFiveWinSetup(), 'p1-1'), 'n2-2');
    expect(result.currentPlayer).toBe('player1');
  });

  it('nodes map reflects chip relocation after forged win', () => {
    const result = moveChip(selectChip(forgeFiveWinSetup(), 'p1-1'), 'n2-2');

    expect(result.nodes.get('n2-2')?.chip?.value).toBe(2);
    expect(result.nodes.get('n1-2')?.chip).toBeNull();
  });
});
