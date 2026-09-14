/**
 * Wave 52 — Queens viewBox leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — viewBox', () => {
  it('matches NUM_RINGS * HEX_SIZE layout size', () => {
    const size = CONFIG.NUM_RINGS * CONFIG.HEX_SIZE * 1.8 * 2 + 100;
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${size} ${size}`);
  });
});
