/**
 * Wave 49 — Queens SVG viewBox bounds leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — viewBox', () => {
  it('sizes viewBox from ring count', () => {
    const size = CONFIG.NUM_RINGS * CONFIG.HEX_SIZE * 1.8 * 2 + 100;
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${size} ${size}`);
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#f8f4e8');
  });
});
