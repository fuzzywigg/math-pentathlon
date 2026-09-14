/**
 * Wave 54 leftover after #240 — Pinball SVG viewBox size. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — board viewBox', () => {
  it('is 300×400 with matching attrs', () => {
    const svg = renderPinballBoard(createInitialState());
    expect(svg.getAttribute('viewBox')).toBe('0 0 300 400');
    expect(svg.getAttribute('width')).toBe('300');
    expect(svg.getAttribute('height')).toBe('400');
  });
});
