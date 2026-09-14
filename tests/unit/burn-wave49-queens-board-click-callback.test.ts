/**
 * Wave 49 — Queens cell click invokes onCellClick. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — click callback', () => {
  it('fires with ring/position', () => {
    const cb = vi.fn();
    const svg = renderBoard(createInitialState(), cb);
    const g = svg.querySelector(`g[data-cell-key="${cellKey(0, 0)}"]`);
    g?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(cb).toHaveBeenCalledWith({ ring: 0, position: 0 });
  });
});
