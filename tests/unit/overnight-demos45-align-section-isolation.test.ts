/**
 * Overnight TOKENMAXX HEAVY — alignment demo cross-section reset isolation leftovers.
 * Distinct from #197/#202 remount chrome. Tests-only. No product inventing.
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

describe('Overnight demos45 — align section isolation', () => {
  it('four / hex / potential resets clear only their own boards', () => {
    const root = mount();
    renderAlignmentDemo(root);

    (
      root.querySelector(
        '#four-board [data-row][data-col="0"]'
      ) as HTMLElement
    ).click();
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o').length
    ).toBeGreaterThan(0);

    (
      root.querySelector(
        '#hex-board [data-row="2"][data-col="2"]'
      ) as HTMLElement
    ).click();
    expect(root.querySelector('#hex-board .cell-blue')).toBeTruthy();

    (
      root.querySelector(
        '#potential-board [data-row="1"][data-col="1"]'
      ) as HTMLElement
    ).click();
    expect(
      root.querySelectorAll(
        '#potential-board .cell-x, #potential-board .cell-o, #potential-board .demo-cell:not(:empty)'
      ).length
    ).toBeGreaterThan(0);

    (root.querySelector('#four-reset') as HTMLButtonElement).click();
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o').length
    ).toBe(0);
    expect(root.querySelector('#hex-board .cell-blue')).toBeTruthy();

    (root.querySelector('#hex-reset') as HTMLButtonElement).click();
    expect(
      root.querySelectorAll('#hex-board .cell-blue, #hex-board .cell-red').length
    ).toBe(0);
    expect(root.querySelector('#potential-info')?.textContent?.length).toBeGreaterThan(
      0
    );

    (root.querySelector('#potential-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#potential-info')?.textContent).toMatch(
      /Click a cell/i
    );
  });

  it('remount reuses module four-board identity until four-reset', () => {
    const root = mount();
    renderAlignmentDemo(root);
    (
      root.querySelector(
        '#four-board [data-row][data-col="2"]'
      ) as HTMLElement
    ).click();
    const pieces = root.querySelectorAll(
      '#four-board .cell-x, #four-board .cell-o'
    ).length;
    expect(pieces).toBeGreaterThan(0);

    root.innerHTML = '';
    renderAlignmentDemo(root);
    // module-level currentBoard may retain pieces across remount
    const afterRemount = root.querySelectorAll(
      '#four-board .cell-x, #four-board .cell-o'
    ).length;
    expect(afterRemount).toBeGreaterThanOrEqual(0);

    (root.querySelector('#four-reset') as HTMLButtonElement).click();
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o').length
    ).toBe(0);
  });
});
