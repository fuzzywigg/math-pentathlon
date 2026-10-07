/**
 * Wave 42 — Kwatro-Sinko "all chips off numbered" alone.
 * Updated for #375 / Div II Highlights: chips-off is required but not sufficient.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  allChipsOffNumbered,
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

/**
 * Four p1 chips scattered on non-numbered nodes; p1-4 still on n0-4.
 * Placement avoids any straight-line 2+1 arithmetic of 4/5 (including gaps),
 * so the last chips-off move is territory-only.
 */
function forgeAlmostAllOff(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-0', 'n2-1');
  state = placeChip(state, 'p1-1', 'n3-3');
  state = placeChip(state, 'p1-2', 'n1-0');
  // Was n3-4 — with gaps, n1-4 / n3-4 / n4-4 formed 8+6−9=5. Park on n2-0 instead.
  state = placeChip(state, 'p1-3', 'n2-0');
  return state;
}

describe('Wave 42 kwatro-sinko — alternative win', () => {
  it('last chip leaving numbered row does not end game without alignment', () => {
    const state = forgeAlmostAllOff();
    const result = moveChip(selectChip(state, 'p1-4'), 'n1-4');

    expect(result.phase).toBe('selectingChip');
    expect(result.winner).toBeNull();
    expect(result.winningAlignment).toBeNull();
    expect(allChipsOffNumbered(result.nodes, result.chips, 'player1')).toBe(
      true
    );
  });

  it('all player1 chips rest on non-numbered nodes after the move', () => {
    const result = moveChip(
      selectChip(forgeAlmostAllOff(), 'p1-4'),
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

  it('move history records null alignment for chips-off-only move', () => {
    const result = moveChip(
      selectChip(forgeAlmostAllOff(), 'p1-4'),
      'n1-4'
    );

    expect(result.moveHistory[0].alignment).toBeNull();
    expect(result.moveHistory[0].player).toBe('player1');
    expect(result.currentPlayer).toBe('player2');
  });

  it('setup has one numbered p1 chip before the move', () => {
    const state = forgeAlmostAllOff();
    const numbered = [...state.chips.values()]
      .filter((c) => c.owner === 'player1')
      .filter((c) => state.nodes.get(c.position!)?.isNumbered);
    expect(numbered).toHaveLength(1);
    expect(numbered[0].id).toBe('p1-4');
  });
});
