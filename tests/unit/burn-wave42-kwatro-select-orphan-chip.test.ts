/**
 * Wave 42 — Kwatro-Sinko selectChip with orphan / stale chip identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import type { KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 42 kwatro-sinko — select orphan chip', () => {
  it('selectChip rejects chip id absent from chips map', () => {
    const state = createInitialState();
    expect(selectChip(state, 'p1-99')).toBe(state);
    expect(selectChip(state, '')).toBe(state);
  });

  it('selectChip rejects chip removed from map while node still references it', () => {
    const state = createInitialState();
    const nodes = new Map(state.nodes);
    const chips = new Map(state.chips);
    chips.delete('p1-0');
    const orphan: KwaState = { ...state, nodes, chips };

    expect(selectChip(orphan, 'p1-0')).toBe(orphan);
    expect(getValidMoves(orphan, 'p1-0')).toEqual([]);
  });

  it('selectChip rejects chip whose node reference was cleared', () => {
    const state = createInitialState();
    const nodes = new Map(state.nodes);
    const node = nodes.get('n0-2');
    if (node) nodes.set('n0-2', { ...node, chip: null });
    const detached: KwaState = { ...state, nodes };

    // Chip still in map with position n0-2 but node has no chip — moves still work
    const moves = getValidMoves(detached, 'p1-2');
    expect(moves).toEqual(['n1-2']);
    const selected = selectChip(detached, 'p1-2');
    expect(selected.selectedChip).toBe('p1-2');
  });

  it('selectChip rejects wrong-player chip even when it has valid moves', () => {
    const state = createInitialState();
    const moves = getValidMoves(state, 'p2-2');
    expect(moves.length).toBeGreaterThan(0);
    expect(selectChip(state, 'p2-2')).toBe(state);
  });
});
