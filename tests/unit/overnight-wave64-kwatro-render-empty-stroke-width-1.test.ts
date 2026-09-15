/**
 * Wave 64 leftover after tip/#306 — Kwatro empty midboard stroke-width 1.
 * Wave55 locked fill/stroke colors; deepen stroke-width leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — render empty stroke-width 1', () => {
  it('n2-2 empty node circle has stroke-width 1', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const circle = el.querySelector('[data-node-id="n2-2"] > circle');
    expect(circle?.getAttribute('stroke-width')).toBe('1');
    expect(circle?.getAttribute('fill')).toBe('#f5f5f5');
  });
});
