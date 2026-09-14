/**
 * Wave 57 leftover after #267 — Queens hex hover brightness filter.
 * Distinct from FIAR brightness leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 57 queens — hover brightness', () => {
  it('mouseenter sets brightness(1.1); mouseleave clears filter', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="0-0"]')!;
    const hex = g.querySelector('path')!;
    g.dispatchEvent(new Event('mouseenter'));
    expect(hex.getAttribute('filter')).toBe('brightness(1.1)');
    g.dispatchEvent(new Event('mouseleave'));
    expect(hex.hasAttribute('filter')).toBe(false);
  });
});
