/**
 * Wave 56 leftover after #256 — Queens opening Blue Queen aria-label.
 * Distinct from wave49 ♛ glyph leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 56 queens — opening queen aria', () => {
  it('announces ring 5 pos 7, Blue Queen on opening queen cell', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="5-7"]')!;
    expect(g.getAttribute('aria-label')).toBe('ring 5 pos 7, Blue Queen');
  });
});
