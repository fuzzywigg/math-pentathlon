/**
 * Wave 49 — Queens hover brightness filter leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — hover filter', () => {
  it('toggles brightness filter on mouseenter/leave', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="0-0"]')!;
    const hex = g.querySelector('path')!;
    g.dispatchEvent(new Event('mouseenter'));
    expect(hex.getAttribute('filter')).toBe('brightness(1.1)');
    g.dispatchEvent(new Event('mouseleave'));
    expect(hex.hasAttribute('filter')).toBe(false);
  });
});
