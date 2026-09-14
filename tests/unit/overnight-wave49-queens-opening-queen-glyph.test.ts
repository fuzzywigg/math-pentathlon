/**
 * Wave 49 — Queens opening queen glyph leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — queen glyph', () => {
  it('renders ♛ on player1 queen cell', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="5-7"]')!;
    expect(g.textContent).toContain('♛');
  });
});
