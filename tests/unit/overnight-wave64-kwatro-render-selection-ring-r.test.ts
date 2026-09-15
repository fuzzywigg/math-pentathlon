/**
 * Wave 64 leftover after tip/#306 — Kwatro selection ring radius 22.
 * Wave51 locked stroke-width 3; deepen r=CHIP_RADIUS+4 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — render selection ring r', () => {
  it('selected ring has r 22', () => {
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
  });
});
