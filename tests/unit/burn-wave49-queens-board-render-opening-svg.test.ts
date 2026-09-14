/**
 * Wave 49 — Queens renderBoard opening SVG chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — opening SVG', () => {
  it('returns svg with viewBox and cell groups', () => {
    const svg = renderBoard(createInitialState(), () => {});
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('viewBox')).toMatch(/^0 0 /);
    expect(svg.querySelectorAll('g[data-cell-key]').length).toBeGreaterThan(50);
  });
});
