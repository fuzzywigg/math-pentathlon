/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball board 300x400 rx leftover.
 * Wave54 sampled viewBox. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball board — size rx', () => {
  it('sets width/height 300/400 and bg rx 10 leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    expect(svg.getAttribute('width')).toBe('300');
    expect(svg.getAttribute('height')).toBe('400');
    const bg = svg.querySelector('rect');
    expect(bg?.getAttribute('rx')).toBe('10');
    expect(bg?.getAttribute('width')).toBe('300');
  });
});
