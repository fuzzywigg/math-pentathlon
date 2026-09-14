/**
 * Wave 59 leftover after #281 — Pent flip CSS + Enter/Space activate.
 * Distinct from wave58 empty/Red/valid-placement/cancel CSS leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { injectPentEmInStyles, renderBoard } from '../../src/games/pent-em-in/board-ui';

beforeEach(() => {
  document.getElementById('pent-em-in-styles')?.remove();
});

describe('Wave 59 pent — flip CSS + keydown', () => {
  it('embeds flip cyan; Enter and Space fire onCellClick', () => {
    injectPentEmInStyles();
    const css = document.getElementById('pent-em-in-styles')?.textContent ?? '';
    expect(css).toMatch(/\.pent-btn-flip/);
    expect(css).toMatch(/#00bcd4/);

    let clicked: { row: number; col: number } | null = null;
    const svg = renderBoard(
      createInitialState(),
      (coord) => {
        clicked = coord;
      },
      () => undefined
    );
    const cell = svg.querySelector('.interaction [data-row="0"][data-col="0"]')!;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(clicked).toEqual({ row: 0, col: 0 });
    clicked = null;
    const cell2 = svg.querySelector('.interaction [data-row="1"][data-col="1"]')!;
    cell2.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(clicked).toEqual({ row: 1, col: 1 });
  });
});
