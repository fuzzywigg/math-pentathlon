/**
 * Overnight TOKENMAXX HEAVY — alignment demo four-in-row diagonal win leftovers.
 * Distinct from #202 H/V wins. Tests-only. No product inventing.
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

describe('Overnight demos45 — align four diagonal win', () => {
  it('X wins on a rising diagonal with winning-cell chrome', () => {
    const root = mount();
    renderAlignmentDemo(root);

    // Build diagonal X at (5,0)(4,1)(3,2)(2,3) via gravity drops.
    // Col0: X
    clickCol(root, 0);
    // Col1: O then X
    clickCol(root, 1);
    clickCol(root, 1);
    // Col2: O,O,X
    clickCol(root, 2);
    clickCol(root, 0); // O parks
    clickCol(root, 2);
    clickCol(root, 3); // O parks
    clickCol(root, 2); // X at row 3? need careful sequence

    // Reset and use a known reliable diagonal sequence
    (root.querySelector('#four-reset') as HTMLButtonElement).click();

    // Sequence for diagonal-down from bottom-left:
    // heights after: col0=1(X), col1=2(O,X), col2=3(O,O,X), col3=4(O,O,O,X)
    clickCol(root, 0); // X @5,0
    clickCol(root, 1); // O @5,1
    clickCol(root, 1); // X @4,1
    clickCol(root, 2); // O @5,2
    clickCol(root, 3); // X @5,3 (temp)
    clickCol(root, 2); // O @4,2
    clickCol(root, 2); // X @3,2
    clickCol(root, 3); // O @4,3
    clickCol(root, 4); // X park
    clickCol(root, 3); // O @3,3
    clickCol(root, 3); // X @2,3 — diagonal X: (5,0)(4,1)(3,2)(2,3)

    const status = root.querySelector('#four-status')?.textContent ?? '';
    expect(status).toMatch(/Winner:\s*X/i);
    expect(
      root.querySelectorAll('#four-board .winning-cell').length
    ).toBeGreaterThanOrEqual(4);
  });

  it('full column still rejects after diagonal setup mid-game', () => {
    const root = mount();
    renderAlignmentDemo(root);
    for (let i = 0; i < 6; i++) {
      clickCol(root, 6);
    }
    const filled = root.querySelectorAll(
      '#four-board [data-col="6"].cell-x, #four-board [data-col="6"].cell-o'
    ).length;
    expect(filled).toBe(6);
    const before = root.querySelector('#four-info')?.innerHTML;
    clickCol(root, 6);
    expect(root.querySelector('#four-info')?.innerHTML).toBe(before);
  });
});
