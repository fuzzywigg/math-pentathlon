/**
 * Overnight TOKENMAXX HEAVY — alignment O-win + potential blocked/open leftovers.
 * Distinct from #220 X diagonal wins. Tests-only.
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

describe('Overnight demos46 — align O-win / potential status', () => {
  it('O wins vertical four-in-a-row with winning-cell chrome', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // X parks in col1; O stacks four in col0
    clickCol(root, 1); // X
    clickCol(root, 0); // O
    clickCol(root, 1); // X
    clickCol(root, 0); // O
    clickCol(root, 1); // X
    clickCol(root, 0); // O
    clickCol(root, 2); // X park
    clickCol(root, 0); // O wins

    const status = root.querySelector('#four-status')?.textContent ?? '';
    expect(status).toMatch(/Winner:\s*O/i);
    expect(
      root.querySelectorAll('#four-board .winning-cell').length
    ).toBeGreaterThanOrEqual(4);

    const before = root.querySelectorAll(
      '#four-board .cell-x, #four-board .cell-o'
    ).length;
    clickCol(root, 3);
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o').length
    ).toBe(before);
  });

  it('potential info surfaces (blocked) and (open) direction status', () => {
    const root = mount();
    renderAlignmentDemo(root);
    // Seeded board has O at (1,2); click empty neighbor to read potentials
    (
      root.querySelector(
        '#potential-board [data-row="1"][data-col="1"]'
      ) as HTMLElement
    ).click();
    const info = root.querySelector('#potential-info')?.textContent ?? '';
    expect(info).toMatch(/Alignment potential/i);
    expect(info).toMatch(/\(blocked\)|\(open\)/);
    // cycle once more on same cell → O then clear; still has status tokens
    (
      root.querySelector(
        '#potential-board [data-row="1"][data-col="1"]'
      ) as HTMLElement
    ).click();
    expect(root.querySelector('#potential-info')?.textContent ?? '').toMatch(
      /\(blocked\)|\(open\)/
    );
  });

  it('X wins on falling diagonal opposite demos45 rising path', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // Falling diagonal X: (2,0)(3,1)(4,2)(5,3)
    // heights: col0=4 X on top of OOO; col1=3; col2=2; col3=1
    clickCol(root, 0); // X @5,0 — will rebuild carefully
    (root.querySelector('#four-reset') as HTMLButtonElement).click();

    // Build bottom-right falling diagonal from (2,0) down to (5,3):
    // col0: O,O,O,X → X at row2
    // col1: O,O,X → X at row3
    // col2: O,X → X at row4
    // col3: X → X at row5
    clickCol(root, 3); // X @5,3
    clickCol(root, 2); // O @5,2
    clickCol(root, 2); // X @4,2
    clickCol(root, 1); // O @5,1
    clickCol(root, 0); // X @5,0 (temp park)
    clickCol(root, 1); // O @4,1
    clickCol(root, 1); // X @3,1
    clickCol(root, 0); // O @4,0
    clickCol(root, 4); // X park
    clickCol(root, 0); // O @3,0
    clickCol(root, 0); // X @2,0 — diagonal (2,0)(3,1)(4,2)(5,3)

    const status = root.querySelector('#four-status')?.textContent ?? '';
    expect(status).toMatch(/Winner:\s*X/i);
    expect(
      root.querySelectorAll('#four-board .winning-cell').length
    ).toBeGreaterThanOrEqual(4);
  });
});
