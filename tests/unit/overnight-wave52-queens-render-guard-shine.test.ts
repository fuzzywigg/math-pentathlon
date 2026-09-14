/**
 * Wave 52 — Queens guard shine leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — guard shine', () => {
  it('draws circle + ellipse shine without ♛ on a guard cell', () => {
    const state = createInitialState();
    const guardKey = [...state.cells.entries()].find(
      ([, c]) => c.piece?.type === 'guard'
    )![0];
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector(`[data-cell-key="${guardKey}"]`)!;
    expect(g.querySelectorAll('circle').length).toBeGreaterThanOrEqual(1);
    expect(g.querySelector('ellipse')).toBeTruthy();
    expect(g.textContent).not.toContain('♛');
  });
});
