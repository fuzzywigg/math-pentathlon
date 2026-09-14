/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko alternative win: all chips on non-numbered spaces. Tests-only.
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

/** Four p1 chips scattered on non-numbered nodes; p1-4 still on n0-4 */
function forgeAlmostAlternativeWin(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-0', 'n2-1');
  state = placeChip(state, 'p1-1', 'n3-3');
  state = placeChip(state, 'p1-2', 'n1-0');
  state = placeChip(state, 'p1-3', 'n3-4');
  return state;
}

describe('Wave 47 kwatro deepen 17 — kwatro-sinko — alternative win', () => {
  it('last chip leaving numbered row ends game without alignment', () => {
    const state = forgeAlmostAlternativeWin();
    const result = moveChip(selectChip(state, 'p1-4'), 'n1-4');

    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.winningAlignment).toBeNull();
  });

  it('all player1 chips rest on non-numbered nodes after alternative win', () => {
    const result = moveChip(
      selectChip(forgeAlmostAlternativeWin(), 'p1-4'),
      'n1-4'
    );

    const p1Chips = [...result.chips.values()].filter(
      (c) => c.owner === 'player1'
    );
    for (const chip of p1Chips) {
      const node = result.nodes.get(chip.position!);
      expect(node?.isNumbered).toBe(false);
    }
  });

  it('move history records null alignment for territory win', () => {
    const result = moveChip(
      selectChip(forgeAlmostAlternativeWin(), 'p1-4'),
      'n1-4'
    );

    expect(result.moveHistory[0].alignment).toBeNull();
    expect(result.moveHistory[0].player).toBe('player1');
  });

  it('setup has one numbered p1 chip before the clinching move', () => {
    const state = forgeAlmostAlternativeWin();
    const numbered = [...state.chips.values()]
      .filter((c) => c.owner === 'player1')
      .filter((c) => state.nodes.get(c.position!)?.isNumbered);
    expect(numbered).toHaveLength(1);
    expect(numbered[0].id).toBe('p1-4');
  });
});
