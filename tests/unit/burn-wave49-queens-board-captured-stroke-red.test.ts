/**
 * Wave 49 — Queens capturedPieces stroke red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — captured stroke', () => {
  it('captured coord gets red stroke', () => {
    const s = {
      ...createInitialState(),
      capturedPieces: [{ ring: 5, position: 1 }],
    };
    const svg = renderBoard(s, () => {});
    const g = svg.querySelector(`g[data-cell-key="${cellKey(5, 1)}"]`);
    expect(g?.querySelector('path')?.getAttribute('stroke')).toBe('#f44336');
    expect(g?.querySelector('path')?.getAttribute('stroke-width')).toBe('3');
  });
});
