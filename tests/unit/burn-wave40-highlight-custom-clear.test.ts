/**
 * Wave 40 — highlight custom cellSelector + clear custom classes leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  markCellsForHighlight,
  clearHighlights,
  injectHighlightStyles,
} from '../../src/core/alignment';

describe('Wave 40 highlight — custom clear + cellSelector', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = document.createElement('div');
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.dataset.cell = `${r}-${c}`;
        container.appendChild(cell);
      }
    }
    // Pre-seed an SVG highlight group to clear
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'alignment-highlight leftover');
    container.appendChild(g);
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.getElementById('alignment-highlight-styles')?.remove();
  });

  it('custom cellSelector marks by data-cell', () => {
    markCellsForHighlight(
      container,
      [
        { row: 1, col: 2 },
        { row: 0, col: 0 },
      ],
      'hl-w40',
      (r, c) => `[data-cell="${r}-${c}"]`
    );
    expect(
      container
        .querySelector('[data-cell="1-2"]')!
        .classList.contains('hl-w40')
    ).toBe(true);
    expect(
      container
        .querySelector('[data-cell="0-0"]')!
        .classList.contains('hl-w40')
    ).toBe(true);
    expect(
      container
        .querySelector('[data-cell="0-1"]')!
        .classList.contains('hl-w40')
    ).toBe(false);
  });

  it('clearHighlights with custom class list removes only those', () => {
    const a = container.querySelector('[data-row="0"][data-col="0"]')!;
    const b = container.querySelector('[data-row="0"][data-col="1"]')!;
    a.classList.add('custom-a', 'highlight-path');
    b.classList.add('custom-b');
    clearHighlights(container, ['custom-a']);
    expect(a.classList.contains('custom-a')).toBe(false);
    expect(a.classList.contains('highlight-path')).toBe(true);
    expect(b.classList.contains('custom-b')).toBe(true);
  });

  it('default clearHighlights removes SVG alignment-highlight groups', () => {
    expect(container.querySelector('.alignment-highlight')).toBeTruthy();
    clearHighlights(container);
    expect(container.querySelector('.alignment-highlight')).toBeNull();
  });

  it('markCellsForHighlight replaces prior marks of same class', () => {
    markCellsForHighlight(container, [{ row: 0, col: 0 }], 'hl-swap');
    markCellsForHighlight(container, [{ row: 2, col: 2 }], 'hl-swap');
    expect(
      container
        .querySelector('[data-row="0"][data-col="0"]')!
        .classList.contains('hl-swap')
    ).toBe(false);
    expect(
      container
        .querySelector('[data-row="2"][data-col="2"]')!
        .classList.contains('hl-swap')
    ).toBe(true);
  });

  it('injectHighlightStyles idempotent by id', () => {
    injectHighlightStyles();
    injectHighlightStyles();
    expect(document.querySelectorAll('#alignment-highlight-styles')).toHaveLength(
      1
    );
  });
});
