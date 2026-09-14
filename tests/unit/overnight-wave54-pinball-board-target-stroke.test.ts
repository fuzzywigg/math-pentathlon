/**
 * Wave 54 leftover after #240 — Pinball target circle radius/stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — target stroke', () => {
  it('paints inner targets r=18 white stroke', () => {
    const svg = renderPinballBoard(createInitialState());
    const inners = [...svg.querySelectorAll('g')].map(
      (g) => g.querySelectorAll('circle')[1]
    );
    expect(inners.every((c) => c.getAttribute('r') === '18')).toBe(true);
    expect(inners.every((c) => c.getAttribute('stroke') === '#fff')).toBe(true);
    expect(inners.every((c) => c.getAttribute('stroke-width') === '2')).toBe(
      true
    );
  });
});
