/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball target value text attrs.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — target text attrs', () => {
  it('value texts use middle/white/12/bold leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const text = [...svg.querySelectorAll('text')].find(
      (t) => t.textContent === '100'
    );
    expect(text?.getAttribute('text-anchor')).toBe('middle');
    expect(text?.getAttribute('fill')).toBe('#fff');
    expect(text?.getAttribute('font-size')).toBe('12');
    expect(text?.getAttribute('font-weight')).toBe('bold');
    expect(text?.getAttribute('y')).toBe('85'); // cy 80 + 5
  });
});
