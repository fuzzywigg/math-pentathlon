/**
 * Wave 49 — FIAR background fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — bg fill', () => {
  it('uses parchment background rect', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const bg = svg.querySelector('rect')!;
    expect(bg.getAttribute('fill')).toBe('#f5f0e6');
    expect(bg.getAttribute('rx')).toBe('12');
  });
});
