/**
 * Wave 56 leftover after #256 — Kwatro numbered node fill palette. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 56 kwatro — numbered fill', () => {
  it('top-row numbered circle is #e8e8e8 / #999 / 2', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const circle = el.querySelector('[data-node-id="n0-0"] circle');
    expect(circle?.getAttribute('fill')).toBe('#e8e8e8');
    expect(circle?.getAttribute('stroke')).toBe('#999');
    expect(circle?.getAttribute('stroke-width')).toBe('2');
  });
});
