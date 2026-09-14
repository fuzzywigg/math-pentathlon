/**
 * Wave 49 — Queens center cell uses gold fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — center fill', () => {
  it('ring-0 hex fill is gold', () => {
    const svg = renderBoard(createInitialState(), () => {});
    const g = svg.querySelector(`g[data-cell-key="${cellKey(0, 0)}"]`);
    const hex = g?.querySelector('path');
    expect(hex?.getAttribute('fill')).toBe('#ffd700');
  });
});
