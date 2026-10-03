/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — O horizontal four-in-a-row.
 * Distinct from O vertical / X horizontal leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function clickCol(root: HTMLElement, col: number): void {
  (
    root.querySelector(
      `#four-board [data-row][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 demos — align O horizontal win', () => {
  it('O wins bottom-row four with winning-cell chrome', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // X parks on col4/col5 while O claims bottom of cols 0..3
    clickCol(root, 4); // X
    clickCol(root, 0); // O
    clickCol(root, 4); // X
    clickCol(root, 1); // O
    clickCol(root, 4); // X
    clickCol(root, 2); // O
    clickCol(root, 5); // X park
    clickCol(root, 3); // O wins horizontal

    expect(root.querySelector('#four-status')?.textContent ?? '').toMatch(
      /Winner:\s*O/i
    );
    expect(
      root.querySelectorAll('#four-board .winning-cell').length
    ).toBeGreaterThanOrEqual(4);
  });
});
