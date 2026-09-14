/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball right flipper pivot.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — right flipper pivot', () => {
  it('right flipper x/y and rotate(20 230 385) leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const right = [...svg.querySelectorAll('rect')].find(
      (r) => r.getAttribute('transform')?.includes('rotate(20')
    );
    expect(right?.getAttribute('x')).toBe('200');
    expect(right?.getAttribute('y')).toBe('380');
    expect(right?.getAttribute('transform')).toBe('rotate(20 230 385)');
  });
});
