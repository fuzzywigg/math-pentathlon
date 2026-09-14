/**
 * Wave 51 leftover after #233 — Kwatro valid node fill/stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 kwatro — valid node fill', () => {
  it('paints #c8e6c9 / #4caf50 on .kwa-valid-node', () => {
    const base = createInitialState();
    const chipId = [...base.chips.keys()].find((id) => base.chips.get(id)?.owner === 'player1')!;
    const state = { ...base, selectedChip: chipId };
    const valids = getValidMoves(state, chipId);
    expect(valids.length).toBeGreaterThan(0);
    const el = renderBoard(state, () => undefined, () => undefined);
    const node = el.querySelector(`[data-node-id="${valids[0]}"] .kwa-valid-node`);
    expect(node?.getAttribute('fill')).toBe('#c8e6c9');
    expect(node?.getAttribute('stroke')).toBe('#4caf50');
    expect(node?.getAttribute('stroke-width')).toBe('3');
  });
});
