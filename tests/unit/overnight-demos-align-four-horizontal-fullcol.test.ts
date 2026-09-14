/**
 * Overnight TOKENMAXX HEAVY — alignment demo horizontal win + full-column reject.
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

function clickCol(root: HTMLElement, col: number): void {
  (
    root.querySelector(
      `#four-board [data-row][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

describe('Overnight demos — align four horizontal + full column', () => {
  it('X wins horizontal four on bottom row with far-column O fillers', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // X: 0,1,2,3 on bottom; O parks in col 6
    clickCol(root, 0);
    clickCol(root, 6);
    clickCol(root, 1);
    clickCol(root, 6);
    clickCol(root, 2);
    clickCol(root, 6);
    clickCol(root, 3);

    expect(root.querySelector('#four-status')?.textContent).toMatch(/Winner:\s*X/i);
    expect(root.querySelector('#four-info')?.textContent).toMatch(/X has/i);
  });

  it('full column drops are ignored; reset restores X to move', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // Fill column 0 completely (6 rows): X O X O X O
    for (let i = 0; i < 3; i++) {
      clickCol(root, 0);
      clickCol(root, 0);
    }
    const filled = root.querySelectorAll('#four-board .cell-x, #four-board .cell-o')
      .length;
    expect(filled).toBe(6);

    const statusBefore = root.querySelector('#four-status')?.textContent;
    clickCol(root, 0); // full — no-op
    expect(root.querySelector('#four-status')?.textContent).toBe(statusBefore);

    (root.querySelector('#four-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#four-status')?.textContent).toMatch(/X/i);
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o').length
    ).toBe(0);
  });
});
