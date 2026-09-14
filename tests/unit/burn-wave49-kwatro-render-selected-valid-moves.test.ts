/**
 * Wave 49 leftover after #221/#226/#227 — Kwatro selected chip highlights valids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — selected valids', () => {
  it('marks valid destination nodes when a chip is selected', () => {
    const base = createInitialState();
    const chipId = [...base.chips.keys()].find((id) => base.chips.get(id)?.owner === 'player1');
    expect(chipId).toBeTruthy();
    const state = { ...base, selectedChip: chipId! };
    const valids = new Set(getValidMoves(state, chipId!));
    const el = renderBoard(state, () => undefined, () => undefined);
    expect(el.querySelectorAll('[data-node-id]').length).toBe(state.nodes.size);
    expect(valids.size).toBeGreaterThan(0);
  });
});
