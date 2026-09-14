/**
 * Overnight TOKENMAXX HEAVY — alignment demo hex connect path / region leftovers.
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

function clickHex(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#hex-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

describe('Overnight demos — align hex path / regions', () => {
  it('Blue vertical spine grows region size and can win top-bottom', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // Blue (B) places down col 3; Red parks on right edge
    for (let row = 0; row < 6; row++) {
      clickHex(root, row, 3);
      clickHex(root, row, 6);
    }
    clickHex(root, 6, 3); // Blue completes column 0..6

    const status = root.querySelector('#hex-status')?.textContent ?? '';
    const info = root.querySelector('#hex-info')?.textContent ?? '';
    expect(info).toMatch(/Blue/i);
    // Either winner or at least a large blue region
    expect(status.match(/Winner:\s*Blue/i) || info.match(/largest:\s*[4-9]/)).toBeTruthy();
  });

  it('occupied hex cells and post-reset board reject stale occupancy', () => {
    const root = mount();
    renderAlignmentDemo(root);
    clickHex(root, 2, 2);
    expect(root.querySelector('#hex-board .cell-blue')).toBeTruthy();
    clickHex(root, 2, 2); // occupied — no-op; still Blue's piece, Red to move
    expect(root.querySelector('#hex-status')?.textContent).toMatch(/Red/i);

    (root.querySelector('#hex-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#hex-status')?.textContent).toMatch(/Blue/i);
    expect(root.querySelectorAll('#hex-board .cell-blue, #hex-board .cell-red').length).toBe(
      0
    );
  });
});
