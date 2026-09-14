/**
 * Wave 51 leftover after #233 — Kwatro selected chip ring stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 kwatro — selected chip stroke', () => {
  it('draws #ff9800 ring around selected chip', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()].find((c) => c.owner === 'player1')!;
    const state = { ...base, selectedChip: chip.id };
    const el = renderBoard(state, () => undefined, () => undefined);
    const node = el.querySelector(`[data-node-id="${chip.position}"]`);
    const ring = [...(node?.querySelectorAll('circle') ?? [])].find(
      (c) => c.getAttribute('stroke') === '#ff9800' && c.getAttribute('fill') === 'none'
    );
    expect(ring?.getAttribute('stroke-width')).toBe('3');
  });
});
