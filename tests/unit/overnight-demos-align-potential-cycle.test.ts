/**
 * Overnight TOKENMAXX HEAVY — alignment demo potential board cycle leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

function clickPot(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#potential-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

describe('Overnight demos — align potential cycle', () => {
  it('empty cell cycles null → X → O → null with potential directions', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // Pre-seeded board has pieces; use a known empty corner
    clickPot(root, 0, 0);
    expect(root.querySelector('#potential-board .selected-cell')).toBeTruthy();
    expect(root.querySelector('#potential-info')?.textContent).toMatch(
      /Alignment potential|horizontal|vertical|diagonal|blocked|open/i
    );
    expect(root.querySelector('#potential-board [data-row="0"][data-col="0"]')?.textContent).toBe(
      'X'
    );

    clickPot(root, 0, 0);
    expect(root.querySelector('#potential-board [data-row="0"][data-col="0"]')?.textContent).toBe(
      'O'
    );

    clickPot(root, 0, 0);
    expect(
      root.querySelector('#potential-board [data-row="0"][data-col="0"]')?.textContent ?? ''
    ).toBe('');
  });

  it('reset clears board and restores click-to-see prompt', () => {
    const root = mount();
    renderAlignmentDemo(root);
    clickPot(root, 4, 4);
    (root.querySelector('#potential-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#potential-info')?.textContent).toMatch(/Click a cell/i);
    expect(
      root.querySelectorAll('#potential-board .cell-x, #potential-board .cell-o').length
    ).toBe(0);
  });
});
