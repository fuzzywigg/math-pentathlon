/**
 * Wave 49 — FIAR hover brightness filter leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — hover filter', () => {
  it('toggles brightness filter on mouseenter/leave', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-node-id="2-2"]')!;
    const circle = g.querySelector('circle')!;
    g.dispatchEvent(new Event('mouseenter'));
    expect(circle.getAttribute('filter')).toBe('brightness(1.1)');
    g.dispatchEvent(new Event('mouseleave'));
    expect(circle.hasAttribute('filter')).toBe(false);
  });
});
