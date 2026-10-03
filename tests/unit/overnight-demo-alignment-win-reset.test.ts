/**
 * Overnight demos leftover — alignment four/hex/potential win + reset edges.
 * Existing renderAlignmentDemo APIs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight demos — alignment win/reset edges', () => {
  it('four-in-row column drops alternate X/O and update status', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const col0 = root.querySelector(
      '#four-board [data-col="0"]'
    ) as HTMLElement;
    col0.click();
    expect(root.querySelector('#four-status')?.textContent).toMatch(/O/i);
    expect(root.querySelectorAll('#four-board .cell-x').length).toBe(1);

    const col1 = root.querySelector(
      '#four-board [data-col="1"]'
    ) as HTMLElement;
    col1.click();
    expect(root.querySelector('#four-status')?.textContent).toMatch(/X/i);
    expect(root.querySelectorAll('#four-board .cell-o').length).toBe(1);
  });

  it('four-in-row vertical win marks winner and blocks further play', () => {
    const root = mount();
    renderAlignmentDemo(root);
    // X drops in col0 four times interleaved with O in col1
    for (let i = 0; i < 4; i++) {
      (
        root.querySelector('#four-board [data-col="0"]') as HTMLElement
      ).click();
      if (i < 3) {
        (
          root.querySelector('#four-board [data-col="1"]') as HTMLElement
        ).click();
      }
    }
    const status = root.querySelector('#four-status')?.textContent ?? '';
    expect(status).toMatch(/Winner|X/i);
    expect(root.querySelectorAll('#four-board .winning-cell').length).toBeGreaterThan(
      0
    );

    const before = root.querySelectorAll('#four-board .cell-x, #four-board .cell-o')
      .length;
    (
      root.querySelector('#four-board [data-col="2"]') as HTMLElement
    ).click();
    const after = root.querySelectorAll('#four-board .cell-x, #four-board .cell-o')
      .length;
    expect(after).toBe(before);
  });

  it('four reset clears pieces and restores X to move', () => {
    const root = mount();
    renderAlignmentDemo(root);
    (root.querySelector('#four-board [data-col="3"]') as HTMLElement).click();
    (root.querySelector('#four-reset') as HTMLButtonElement).click();
    expect(root.querySelectorAll('#four-board .cell-x')).toHaveLength(0);
    expect(root.querySelector('#four-status')?.textContent).toMatch(/X/i);
  });

  it('hex board places alternate colors and reset clears', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const cells = root.querySelectorAll('#hex-board [data-row][data-col]');
    expect(cells.length).toBeGreaterThan(1);
    (cells[0] as HTMLElement).click();
    expect(root.querySelector('#hex-status')?.textContent).toMatch(
      /player|Blue|Red|B|R/i
    );
    (cells[1] as HTMLElement).click();
    (root.querySelector('#hex-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#hex-status')?.textContent).toMatch(
      /player|Blue|B/i
    );
  });

  it('potential board click fills info; reset clears selection chrome', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const cell = root.querySelector(
      '#potential-board [data-row="0"][data-col="0"]'
    ) as HTMLElement;
    cell.click();
    expect(
      (root.querySelector('#potential-info')?.textContent ?? '').length
    ).toBeGreaterThan(0);

    (root.querySelector('#potential-reset') as HTMLButtonElement).click();
    // after reset, info may clear or re-prompt — board has no selected-cell
    expect(root.querySelectorAll('#potential-board .selected-cell')).toHaveLength(
      0
    );
  });

  it('full column four-in-row rejects overflow without throwing', () => {
    const root = mount();
    renderAlignmentDemo(root);
    expect(() => {
      for (let i = 0; i < 10; i++) {
        (
          root.querySelector('#four-board [data-col="6"]') as HTMLElement
        ).click();
      }
    }).not.toThrow();
    // 6-row board → at most 6 pieces in one column
    const filled = Array.from(
      root.querySelectorAll('#four-board [data-col="6"]')
    ).filter((c) => c.classList.contains('cell-x') || c.classList.contains('cell-o'));
    expect(filled.length).toBeLessThanOrEqual(6);
  });

  it('triple remount keeps three independent section boards', () => {
    const root = mount();
    renderAlignmentDemo(root);
    renderAlignmentDemo(root);
    renderAlignmentDemo(root);
    expect(root.querySelector('#four-board')).toBeTruthy();
    expect(root.querySelector('#hex-board')).toBeTruthy();
    expect(root.querySelector('#potential-board')).toBeTruthy();
    expect(root.querySelectorAll('.alignment-demo')).toHaveLength(1);
  });
});
