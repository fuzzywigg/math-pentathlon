/**
 * Wave 65 leftover after tip/#315 — Kwatro selection ring stroke chrome.
 * Valid-node fill covered; deepen selected ring leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 65 kwatro — render selection ring stroke', () => {
  it('selected chip draws orange ring stroke-width 3', () => {
    const selected = selectChip(createInitialState(), 'p1-0');
    const el = renderBoard(selected, () => undefined, () => undefined);
    const chipNode = el.querySelector('[data-node-id="n0-0"]');
    const circles = [...(chipNode?.querySelectorAll('circle') ?? [])];
    const ring = circles.find((c) => c.getAttribute('fill') === 'none');
    expect(ring?.getAttribute('stroke')).toBe('#ff9800');
    expect(ring?.getAttribute('stroke-width')).toBe('3');
    expect(ring?.getAttribute('r')).toBe('22');
  });
});
