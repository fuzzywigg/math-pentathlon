/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko clearSelection / getValidMoves empty leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  clearSelection,
  getValidMoves,
  isValidMove,
} from '../../src/games/kwatro-sinko/rules';
import type { KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 47 kwatro deepen 0 — kwatro-sinko — clear valid empty', () => {
  it('clearSelection drops selectedChip back to selectingChip', () => {
    const selected = selectChip(createInitialState(), 'p1-0');
    expect(selected.phase).toBe('selectingDest');
    const cleared = clearSelection(selected);
    expect(cleared.selectedChip).toBeNull();
    expect(cleared.phase).toBe('selectingChip');
  });

  it('clearSelection is idempotent from opening', () => {
    const state = createInitialState();
    const cleared = clearSelection(state);
    expect(cleared.selectedChip).toBeNull();
    expect(cleared.phase).toBe('selectingChip');
  });

  it('getValidMoves empty for missing / unknown node chip', () => {
    const state = createInitialState();
    expect(getValidMoves(state, 'ghost')).toEqual([]);
    expect(isValidMove(state, 'ghost', 'n1-0')).toBe(false);
  });

  it('getValidMoves empty when all connections occupied', () => {
    const state = createInitialState();
    // Fill every empty node so no chip can move
    const nodes = new Map(state.nodes);
    const chips = new Map(state.chips);
    let blocker = 0;
    for (const [id, node] of nodes) {
      if (!node.chip) {
        const chip = {
          id: `block-${blocker++}`,
          value: 0,
          owner: 'player2' as const,
          position: id,
        };
        chips.set(chip.id, chip);
        nodes.set(id, { ...node, chip });
      }
    }
    const packed: KwaState = { ...state, nodes, chips };
    expect(getValidMoves(packed, 'p1-0')).toEqual([]);
    expect(selectChip(packed, 'p1-0')).toBe(packed);
  });
});
