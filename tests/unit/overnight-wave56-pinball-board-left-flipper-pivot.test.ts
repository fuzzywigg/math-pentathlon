/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball left flipper pivot.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — left flipper pivot', () => {
  it('left flipper x/y and rotate(-20 70 385) leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const left = [...svg.querySelectorAll('rect')].find(
      (r) => r.getAttribute('transform')?.includes('rotate(-20')
    );
    expect(left?.getAttribute('x')).toBe('40');
    expect(left?.getAttribute('y')).toBe('380');
    expect(left?.getAttribute('transform')).toBe('rotate(-20 70 385)');
  });
});
