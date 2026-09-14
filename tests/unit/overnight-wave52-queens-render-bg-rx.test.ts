/**
 * Wave 52 — Queens background rx leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — bg rx', () => {
  it('uses #f8f4e8 fill and rx 12 on background rect', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const bg = svg.querySelector('rect')!;
    expect(bg.getAttribute('fill')).toBe('#f8f4e8');
    expect(bg.getAttribute('rx')).toBe('12');
  });
});
