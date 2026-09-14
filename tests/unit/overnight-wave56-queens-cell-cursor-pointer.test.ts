/**
 * Wave 56 leftover after #256 — Queens cell group cursor pointer.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 56 queens — cell cursor pointer', () => {
  it('sets style.cursor pointer on cell groups', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="0-0"]') as SVGGElement;
    expect(g.style.cursor).toBe('pointer');
  });
});
