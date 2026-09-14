/**
 * Overnight HEAVY leftovers after #234 — Kwatro kwa-valid-node class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 kwatro — valid node class', () => {
  it('adds kwa-valid-node for destinations of selected chip', () => {
    const base = createInitialState();
    const chipId = [...base.chips.keys()].find(
      (id) => base.chips.get(id)?.owner === 'player1'
    )!;
    const state = { ...base, selectedChip: chipId };
    const valids = getValidMoves(state, chipId);
    expect(valids.length).toBeGreaterThan(0);
    const el = renderBoard(state, () => undefined, () => undefined);
    expect(el.querySelectorAll('.kwa-valid-node').length).toBe(valids.length);
  });
});
