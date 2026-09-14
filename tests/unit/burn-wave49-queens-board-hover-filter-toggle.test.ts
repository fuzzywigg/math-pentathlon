/**
 * Wave 49 — Queens hover brightness filter toggle. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — hover filter', () => {
  it('sets and clears brightness filter', () => {
    const svg = renderBoard(createInitialState(), () => {});
    const g = svg.querySelector(`g[data-cell-key="${cellKey(0, 0)}"]`);
    const hex = g?.querySelector('path');
    g?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(hex?.getAttribute('filter')).toBe('brightness(1.1)');
    g?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(hex?.hasAttribute('filter')).toBe(false);
  });
});
