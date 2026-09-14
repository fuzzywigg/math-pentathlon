/**
 * Wave 52 — FIAR background exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 52 fiar — bg exact', () => {
  it('uses #f5f0e6 fill and rx 12', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const bg = svg.querySelector('rect')!;
    expect(bg.getAttribute('fill')).toBe('#f5f0e6');
    expect(bg.getAttribute('rx')).toBe('12');
  });
});
