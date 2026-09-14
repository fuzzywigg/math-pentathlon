/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball flipper rx/width leftover.
 * Wave52 sampled rotate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball board — flipper rx', () => {
  it('flippers are 60x10 with rx 5 leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const rects = Array.from(svg.querySelectorAll('rect'));
    const flippers = rects.filter((r) => r.getAttribute('fill') === '#ff9800');
    expect(flippers.length).toBe(2);
    for (const f of flippers) {
      expect(f.getAttribute('width')).toBe('60');
      expect(f.getAttribute('height')).toBe('10');
      expect(f.getAttribute('rx')).toBe('5');
    }
  });
});
