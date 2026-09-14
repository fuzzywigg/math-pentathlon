/**
 * Wave 48 — Pinball renderPinballBoard SVG targets. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — svg board', () => {
  it('renders board class and target value texts', () => {
    const svg = renderPinballBoard(createInitialState());
    expect(svg.classList.contains('pinball-board')).toBe(true);
    const texts = [...svg.querySelectorAll('text')].map((t) => t.textContent);
    expect(texts).toContain('100');
    expect(texts).toContain('10');
  });
});
