/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — Blue hex top–bottom win + post-win lock.
 * Distinct from soft Blue spine / Red LR leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function clickHex(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#hex-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 demos — align Blue hex post-win lock', () => {
  it('Blue vertical spine wins hard; post-win click no-ops; reset restores Blue', () => {
    const root = mount();
    renderAlignmentDemo(root);

    for (let row = 0; row < 6; row++) {
      clickHex(root, row, 3);
      clickHex(root, row, 6);
    }
    clickHex(root, 6, 3);

    const status = root.querySelector('#hex-status')?.textContent ?? '';
    expect(status).toMatch(/Winner:\s*Blue/i);
    expect(
      root.querySelectorAll('#hex-board .winning-cell').length
    ).toBeGreaterThan(0);

    const before = root.querySelector('#hex-status')?.innerHTML;
    clickHex(root, 1, 1);
    expect(root.querySelector('#hex-status')?.innerHTML).toBe(before);

    (root.querySelector('#hex-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#hex-status')?.textContent).toMatch(/Blue/i);
    expect(
      root.querySelectorAll('#hex-board .cell-blue, #hex-board .cell-red').length
    ).toBe(0);
  });
});
