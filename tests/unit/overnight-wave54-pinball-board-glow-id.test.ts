/**
 * Wave 54 leftover after #240 — Pinball target-glow gradient. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — glow id', () => {
  it('defines target-glow and paints glows with it', () => {
    const svg = renderPinballBoard(createInitialState());
    expect(svg.querySelector('#target-glow')).toBeTruthy();
    const glows = [...svg.querySelectorAll('g circle')].filter(
      (c) => c.getAttribute('fill') === 'url(#target-glow)'
    );
    expect(glows.length).toBe(10);
    expect(glows.every((c) => c.getAttribute('r') === '25')).toBe(true);
  });
});
