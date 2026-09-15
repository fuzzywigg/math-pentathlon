/**
 * Wave 66 leftover after tip/#316 — Kwatro node r22 / chip r18 radii.
 * Soft elsewhere; deepen NODE/CHIP_RADIUS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render node chip radii', () => {
  it('empty node r 22 and chip circle r 18', () => {
    const state = createInitialState();
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    const el = renderBoard(state, () => undefined, () => undefined);
    const empty = el.querySelector('[data-node-id="n2-2"] > circle');
    expect(empty?.getAttribute('r')).toBe('22');
    const node = el.querySelector(`[data-node-id="${chip.position}"]`);
    const chipCircle = [...(node?.querySelectorAll('circle') ?? [])].find(
      (c) => c.getAttribute('r') === '18'
    );
    expect(chipCircle).toBeTruthy();
  });
});
