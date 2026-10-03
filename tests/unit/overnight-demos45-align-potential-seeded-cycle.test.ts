/**
 * Overnight TOKENMAXX HEAVY — alignment potential seeded mid-board cycle leftovers.
 * Distinct from #202 empty-corner potential cycle. Tests-only.
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

function clickPotential(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#potential-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

describe('Overnight demos45 — align potential seeded cycle', () => {
  it('cycles seeded (2,2) X→O→null with potential chrome', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // Pre-seeded board already has X at (2,2)
    expect(
      root.querySelector('#potential-board [data-row="2"][data-col="2"]')
        ?.textContent
    ).toBe('X');

    clickPotential(root, 2, 2);
    expect(root.querySelector('#potential-info')?.textContent).toMatch(
      /Alignment potential/i
    );
    expect(
      root.querySelector('#potential-board [data-row="2"][data-col="2"]')
        ?.textContent
    ).toBe('O');

    clickPotential(root, 2, 2);
    const cell = root.querySelector(
      '#potential-board [data-row="2"][data-col="2"]'
    ) as HTMLElement;
    expect(cell.textContent?.trim() ?? '').toBe('');
    // handleClick still re-renders with selection coords after clear
    expect(root.querySelector('#potential-info')?.textContent).toMatch(
      /Alignment potential|\(2,\s*2\)|Click a cell/i
    );
  });

  it('neighbor seed keeps independent potential readout', () => {
    const root = mount();
    renderAlignmentDemo(root);
    // (2,3) is pre-seeded X; click cycles to O and shows potential at that cell
    clickPotential(root, 2, 3);
    expect(root.querySelector('#potential-info')?.textContent).toMatch(
      /\(2,\s*3\)/
    );
    expect(
      root.querySelector('#potential-board [data-row="2"][data-col="3"]')
        ?.textContent
    ).toBe('O');
    // original (2,2) seed remains X until touched
    expect(
      root.querySelector('#potential-board [data-row="2"][data-col="2"]')
        ?.textContent
    ).toBe('X');
  });
});
