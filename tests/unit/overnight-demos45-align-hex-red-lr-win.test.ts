/**
 * Overnight TOKENMAXX HEAVY — alignment demo Red left–right hex win leftovers.
 * Distinct from #202 Blue vertical spine. Tests-only. No product inventing.
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

describe('Overnight demos45 — align hex Red LR win', () => {
  it('Red left–right spine wins; post-win clicks no-op; reset restores Blue', () => {
    const root = mount();
    renderAlignmentDemo(root);

    const redTargets: Array<[number, number]> = [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ];
    const blueParks: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [2, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [0, 1],
    ];
    for (let i = 0; i < redTargets.length; i++) {
      clickHex(root, blueParks[i][0], blueParks[i][1]);
      clickHex(root, redTargets[i][0], redTargets[i][1]);
    }

    const status = root.querySelector('#hex-status')?.textContent ?? '';
    expect(status).toMatch(/Winner:\s*Red/i);
    expect(
      root.querySelectorAll('#hex-board .winning-cell').length
    ).toBeGreaterThanOrEqual(7);

    const before = root.querySelector('#hex-status')?.innerHTML;
    clickHex(root, 1, 1);
    expect(root.querySelector('#hex-status')?.innerHTML).toBe(before);

    (root.querySelector('#hex-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#hex-status')?.textContent).toMatch(/Blue/i);
    expect(
      root.querySelectorAll('#hex-board .cell-blue, #hex-board .cell-red').length
    ).toBe(0);
  });

  it('Red region info grows along a horizontal chain before win', () => {
    const root = mount();
    renderAlignmentDemo(root);
    clickHex(root, 1, 1); // Blue
    clickHex(root, 4, 1); // Red
    clickHex(root, 1, 2); // Blue
    clickHex(root, 4, 2); // Red
    const info = root.querySelector('#hex-info')?.textContent ?? '';
    expect(info).toMatch(/Red/i);
    expect(info).toMatch(/largest:\s*[2-9]/);
  });
});
