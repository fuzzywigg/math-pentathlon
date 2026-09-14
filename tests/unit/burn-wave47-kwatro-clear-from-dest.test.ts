/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko clearSelection from selectingDest preserves board. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  clearSelection,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 47 kwatro deepen 18 — kwatro-sinko — clear from selectingDest', () => {
  it('clearSelection from selectingDest restores selectingChip phase', () => {
    const selected = selectChip(createInitialState(), 'p1-2');
    expect(selected.phase).toBe('selectingDest');
    expect(selected.selectedChip).toBe('p1-2');

    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingChip');
    expect(cleared.selectedChip).toBeNull();
  });

  it('clearSelection does not mutate nodes, chips, or currentPlayer', () => {
    const base = createInitialState();
    const selected = selectChip(base, 'p1-0');
    const cleared = clearSelection(selected);

    expect(cleared.currentPlayer).toBe('player1');
    expect(cleared.chips).toEqual(selected.chips);
    expect(cleared.nodes).toEqual(selected.nodes);
    expect(cleared.moveHistory).toEqual([]);
  });

  it('after clear, same chip can be re-selected', () => {
    const once = selectChip(createInitialState(), 'p1-3');
    const cleared = clearSelection(once);
    const again = selectChip(cleared, 'p1-3');

    expect(again.phase).toBe('selectingDest');
    expect(again.selectedChip).toBe('p1-3');
  });

  it('valid moves unchanged across select-clear cycle', () => {
    const state = createInitialState();
    const before = getValidMoves(state, 'p1-1');
    const after = getValidMoves(
      clearSelection(selectChip(state, 'p1-1')),
      'p1-1'
    );
    expect(after).toEqual(before);
  });
});
