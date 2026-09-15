/**
 * Wave 66 leftover after tip/#316 — Kwatro selection ring stroke chrome.
 * Wave51 locks fill none presence; deepen stroke/r leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render selection ring stroke', () => {
  it('selected ring is #ff9800 stroke-width 3 r 22 fill none', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()].find((c) => c.owner === 'player1')!;
    const state = { ...base, selectedChip: chip.id };
    const el = renderBoard(state, () => undefined, () => undefined);
    const node = el.querySelector(`[data-node-id="${chip.position}"]`);
    const ring = [...(node?.querySelectorAll('circle') ?? [])].find(
      (c) =>
        c.getAttribute('stroke') === '#ff9800' && c.getAttribute('fill') === 'none'
    );
    expect(ring?.getAttribute('r')).toBe('22');
    expect(ring?.getAttribute('stroke-width')).toBe('3');
  });
});
