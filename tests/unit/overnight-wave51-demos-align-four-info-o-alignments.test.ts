/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — four-info O alignments (2+) copy.
 * Distinct from X-has assertions. Tests-only.
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

describe('Wave 51 demos — align four-info O alignments', () => {
  it('after X/O exchange, four-info reports O has N alignments (2+)', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // Build a length-2 O pair on bottom of adjacent cols without winning
    clickCol(root, 0); // X
    clickCol(root, 1); // O
    clickCol(root, 2); // X
    clickCol(root, 1); // O stacks → vertical O pair

    expect(root.querySelector('#four-info')?.textContent ?? '').toMatch(
      /O has \d+ alignments \(2\+\)/
    );
  });
});
