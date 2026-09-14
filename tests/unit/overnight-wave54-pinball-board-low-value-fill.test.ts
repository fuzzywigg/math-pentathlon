/**
 * Wave 54 leftover after #240 — Pinball low-value target fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — low-value fill', () => {
  it('paints 30/20/10 targets #4caf50', () => {
    const svg = renderPinballBoard(createInitialState());
    const greens = [...svg.querySelectorAll('g')].filter((g) => {
      const n = Number(g.querySelector('text')?.textContent);
      const fill = g.querySelectorAll('circle')[1]?.getAttribute('fill');
      return n < 50 && fill === '#4caf50';
    });
    expect(greens.length).toBe(7);
  });
});
