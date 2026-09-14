/**
 * Wave 41 — Kwatro-Sinko isValidMove / moveChip reject leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  getValidMoves,
  isValidMove,
  moveChip,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 41 kwatro — reject occupied / illegal destinations', () => {
  it('isValidMove rejects occupied top-row neighbor and off-board ids', () => {
    const state = createInitialState();
    expect(isValidMove(state, 'p1-0', 'n0-1')).toBe(false);
    expect(isValidMove(state, 'p1-0', 'n9-9')).toBe(false);
    expect(isValidMove(state, 'p1-0', 'ghost')).toBe(false);
  });

  it('isValidMove rejects when chip has no empty connections after fill', () => {
    const state = createInitialState();
    // Surround p1-0's only opening neighbor n1-0 by occupying it with a clone of itself
    const nodes = new Map(state.nodes);
    const chips = new Map(state.chips);
    const filler = { ...chips.get('p2-0')!, id: 'blocker', position: 'n1-0' };
    chips.set('blocker', filler);
    const n10 = nodes.get('n1-0')!;
    nodes.set('n1-0', { ...n10, chip: filler });
    // Also block diagonal-adjacent empties if present by filling all empty neighbors
    const chip = chips.get('p1-0')!;
    const node = nodes.get(chip.position!)!;
    for (const conn of node.connections) {
      const c = nodes.get(conn);
      if (c && !c.chip) {
        const b = { ...filler, id: `b-${conn}`, position: conn };
        chips.set(b.id, b);
        nodes.set(conn, { ...c, chip: b });
      }
    }
    const trapped = { ...state, nodes, chips };
    expect(getValidMoves(trapped, 'p1-0')).toEqual([]);
    expect(isValidMove(trapped, 'p1-0', 'n1-0')).toBe(false);
  });

  it('moveChip is identity without selection and on illegal dest after select', () => {
    const open = createInitialState();
    expect(moveChip(open, 'n1-0')).toBe(open);

    let state = selectChip(open, 'p1-0');
    expect(state.phase).toBe('selectingDest');
    const before = state;
    state = moveChip(state, 'n0-1'); // occupied
    expect(state).toBe(before);
    state = moveChip(state, 'n2-2'); // not adjacent from corner
    expect(state).toBe(before);
  });

  it('moveChip rejects destination that is not in getValidMoves', () => {
    let state = createInitialState();
    state = selectChip(state, 'p1-2');
    const valid = new Set(getValidMoves(state, 'p1-2'));
    for (const id of state.nodes.keys()) {
      if (!valid.has(id)) {
        expect(isValidMove(state, 'p1-2', id)).toBe(false);
        expect(moveChip(state, id)).toBe(state);
      }
    }
  });
});
