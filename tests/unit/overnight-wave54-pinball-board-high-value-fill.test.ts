/**
 * Wave 54 leftover after #240 — Pinball high-value target fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — high-value fill', () => {
  it('paints 100/50 targets #f44336', () => {
    const svg = renderPinballBoard(createInitialState());
    const reds = [...svg.querySelectorAll('g')].filter((g) => {
      const label = g.querySelector('text')?.textContent;
      const fill = g.querySelectorAll('circle')[1]?.getAttribute('fill');
      return (label === '100' || label === '50') && fill === '#f44336';
    });
    expect(reds.length).toBe(3);
  });
});
