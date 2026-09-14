/**
 * Wave 42 — Kwatro-Sinko forged alignment win with result 5 via moveChip. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  passTurn,
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

/** 3 + 7 - 5 = 5 along row 2; mover adjacent at n1-2 */
function forgeFiveWinSetup(): KwaState {
  let state = passTurn(createInitialState());
  expect(state.currentPlayer).toBe('player2');
  state = placeChip(state, 'p2-1', 'n2-0'); // value 3
  state = placeChip(state, 'p2-3', 'n2-1'); // value 7
  state = placeChip(state, 'p2-2', 'n1-2'); // value 5 → n2-2
  return state;
}

describe('Wave 42 kwatro-sinko — alignment win five', () => {
  it('player2 moveChip triggers gameOver with winner player2', () => {
    const state = forgeFiveWinSetup();
    const result = moveChip(selectChip(state, 'p2-2'), 'n2-2');

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player2');
  });

  it('alignment result is 5 with three chips on the forged line', () => {
    const result = moveChip(selectChip(forgeFiveWinSetup(), 'p2-2'), 'n2-2');

    expect(result.winningAlignment?.result).toBe(5);
    expect(result.winningAlignment?.chips.map((c) => c.value).sort()).toEqual([
      3, 5, 7,
    ]);
  });

  it('winning move keeps player2 as currentPlayer when game ends', () => {
    const result = moveChip(selectChip(forgeFiveWinSetup(), 'p2-2'), 'n2-2');
    expect(result.currentPlayer).toBe('player2');
  });

  it('nodes map reflects chip relocation after forged win', () => {
    const result = moveChip(selectChip(forgeFiveWinSetup(), 'p2-2'), 'n2-2');

    expect(result.nodes.get('n2-2')?.chip?.value).toBe(5);
    expect(result.nodes.get('n1-2')?.chip).toBeNull();
  });
});
