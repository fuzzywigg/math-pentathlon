/**
 * Wave 49 — Queens cell click callback leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — click activate', () => {
  it('forwards ring/position on cell click', () => {
    const onClick = vi.fn();
    const svg = renderBoard(createInitialState(), onClick);
    const g = svg.querySelector('[data-cell-key="0-0"]')!;
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith({ ring: 0, position: 0 });
  });
});
