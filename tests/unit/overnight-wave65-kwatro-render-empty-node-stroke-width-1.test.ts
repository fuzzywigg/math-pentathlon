/**
 * Wave 65 leftover after tip/#315 — Kwatro empty mid-board stroke-width 1.
 * Numbered fills covered; deepen empty #f5f5f5 stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 65 kwatro — render empty node stroke-width 1', () => {
  it('empty center node uses #f5f5f5 fill and stroke-width 1', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const circle = el.querySelector('[data-node-id="n2-2"] > circle');
    expect(circle?.getAttribute('fill')).toBe('#f5f5f5');
    expect(circle?.getAttribute('stroke')).toBe('#ccc');
    expect(circle?.getAttribute('stroke-width')).toBe('1');
  });
});
