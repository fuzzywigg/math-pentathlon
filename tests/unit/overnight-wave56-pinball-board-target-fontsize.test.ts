/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball target value font-size 12.
 * Board size/rx/fill covered; text size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — target font-size', () => {
  it('stamps font-size 12 on target value texts leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const texts = Array.from(svg.querySelectorAll('text'));
    expect(texts.length).toBeGreaterThan(0);
    for (const t of texts) {
      expect(t.getAttribute('font-size')).toBe('12');
      expect(t.getAttribute('font-weight')).toBe('bold');
      expect(t.getAttribute('fill')).toBe('#fff');
      expect(t.getAttribute('text-anchor')).toBe('middle');
    }
  });
});
