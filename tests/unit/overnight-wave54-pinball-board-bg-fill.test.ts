/**
 * Wave 54 leftover after #240 — Pinball SVG background fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — board bg', () => {
  it('uses #1a237e navy with rx 10', () => {
    const svg = renderPinballBoard(createInitialState());
    const bg = svg.querySelector('rect');
    expect(bg?.getAttribute('fill')).toBe('#1a237e');
    expect(bg?.getAttribute('rx')).toBe('10');
    expect(bg?.getAttribute('width')).toBe('300');
    expect(bg?.getAttribute('height')).toBe('400');
  });
});
