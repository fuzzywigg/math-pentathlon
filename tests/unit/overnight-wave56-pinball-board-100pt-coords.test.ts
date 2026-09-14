/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball 100pt target coords.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — 100pt coords', () => {
  it('100-pt target circle is cx=150 cy=80 leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const text = [...svg.querySelectorAll('text')].find(
      (t) => t.textContent === '100'
    );
    const group = text?.parentElement;
    const circle = group?.querySelectorAll('circle')[1]; // solid target after glow
    expect(circle?.getAttribute('cx')).toBe('150');
    expect(circle?.getAttribute('cy')).toBe('80');
  });
});
